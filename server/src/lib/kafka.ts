import { Kafka, type Consumer, type Producer } from "kafkajs";
import { eq, sql } from "drizzle-orm";
import { env } from "../../env";
import { db } from "../db/db";
import { urlsTable } from "../db/schema";

export const CLICK_EVENTS_TOPIC = "url.clicks";

type ClickEvent = { shortCode: string; clickedAt: string };

export const kafka = new Kafka({
  clientId: env.KAFKA_CLIENT_ID,
  brokers: env.KAFKA_BROKERS.split(",")
    .map((broker) => broker.trim())
    .filter(Boolean),
});

let producer: Producer | null = null;
let consumer: Consumer | null = null;

async function handleClickEvent(event: ClickEvent) {
  await db
    .update(urlsTable)
    .set({ clicks: sql`${urlsTable.clicks} + 1` })
    .where(eq(urlsTable.shortCode, event.shortCode));
}

/**
 * Connects the producer and consumer. If Kafka is unreachable the app keeps
 * running; clicks fall back to being written straight to Postgres.
 */
export async function startKafka() {
  try {
    const admin = kafka.admin();
    await admin.connect();
    await admin.createTopics({
      topics: [{ topic: CLICK_EVENTS_TOPIC, numPartitions: 3 }],
      waitForLeaders: true,
    });
    await admin.disconnect();

    producer = kafka.producer();
    await producer.connect();

    consumer = kafka.consumer({ groupId: env.KAFKA_GROUP_ID });
    await consumer.connect();
    await consumer.subscribe({
      topic: CLICK_EVENTS_TOPIC,
      fromBeginning: false,
    });
    await consumer.run({
      eachMessage: async ({ message }) => {
        if (!message.value) return;
        try {
          await handleClickEvent(JSON.parse(message.value.toString()));
        } catch (error) {
          console.error("Failed to process click event:", error);
        }
      },
    });

    console.log("Kafka producer and consumer connected");
  } catch (error) {
    console.error(
      "Kafka unavailable, click counts will be written directly to Postgres:",
      error,
    );
  }
}

export function isKafkaReady() {
  return producer !== null;
}

export async function publishClickEvent(shortCode: string) {
  if (!producer) {
    throw new Error("Kafka producer is not connected");
  }

  const event: ClickEvent = { shortCode, clickedAt: new Date().toISOString() };

  await producer.send({
    topic: CLICK_EVENTS_TOPIC,
    messages: [{ key: shortCode, value: JSON.stringify(event) }],
  });
}

export async function stopKafka() {
  await Promise.allSettled([producer?.disconnect(), consumer?.disconnect()]);
  producer = null;
  consumer = null;
}
