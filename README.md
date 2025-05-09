# AWS Event-Driven Order Notification System

This project implements a simplified backend order processing system using AWS event-driven services.

## 📦 Technologies Used
- **Amazon SNS**: Publishes new order messages
- **Amazon SQS**: Buffers order events
- **AWS Lambda**: Processes orders and writes to DynamoDB
- **Amazon DynamoDB**: Stores order data
- **Dead-Letter Queue (DLQ)**: Handles failed messages

## 🔧 Setup Instructions

### 1. DynamoDB
- Table Name: `Orders`
- Partition Key: `orderId` (String)
- Attributes: `userId`, `itemName`, `quantity`, `status`, `timestamp`

### 2. SNS Topic
- Topic Name: `OrderTopic`
- Publish new order messages in JSON format

### 3. SQS Queue
- Queue Name: `OrderQueue`
- Subscribed to: `OrderTopic`
- DLQ: `OrderDLQ` with `maxReceiveCount = 3`

### 4. Lambda Function
- Name: `ProcessOrderFunction`
- Trigger: `OrderQueue` (SQS)
- Behavior:
  - Parses SQS message (SNS wrapped)
  - Stores it in DynamoDB
  - Logs the event

## 📈 Architecture Diagram


## 🚀 Testing the Flow

1. Publish a message to SNS:
```json
{
  "orderId": "O1234",
  "userId": "U123",
  "itemName": "Laptop",
  "quantity": 1,
  "status": "new",
  "timestamp": "2025-05-03T12:00:00Z"
}
