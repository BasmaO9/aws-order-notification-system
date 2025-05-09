import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";

const client = new DynamoDBClient({ region: "us-east-1" });

export const handler = async (event) => {
  console.log("🟢 Lambda was triggered!");
  console.log("Raw event:", JSON.stringify(event));

  for (const record of event.Records) {
    try {
      // Step 1: Parse the SQS body
      const body = JSON.parse(record.body);

      // Step 2: Parse the SNS message inside the body
      const message = typeof body.Message === 'string' ? JSON.parse(body.Message) : body.Message;

      console.log("✅ Parsed order message:", message);

      const { orderId, userId, itemName, quantity, status, timestamp } = message;

      const params = {
        TableName: "Orders",
        Item: {
          orderId: { S: orderId },
          userId: { S: userId },
          itemName: { S: itemName },
          quantity: { N: quantity.toString() },
          status: { S: status },
          timestamp: { S: timestamp },
        },
      };

      const command = new PutItemCommand(params);
      await client.send(command);

      console.log(`✅ Order ${orderId} saved to DynamoDB.`);
    } catch (error) {
      console.error("❌ Error processing record:", error);
      throw error; // let SQS retry or DLQ
    }
  }

  return {
    statusCode: 200,
    body: JSON.stringify("Order(s) processed successfully"),
  };
};
