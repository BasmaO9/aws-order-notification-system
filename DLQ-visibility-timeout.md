# DLQ and Visibility Timeout – Explanation

During this assignment, I realized how important both visibility timeout and dead-letter queues (DLQ) are when building a reliable, event-driven system on AWS.

### 🕓 Visibility Timeout

The visibility timeout setting on my SQS queue made sure that when a message was being processed by my Lambda function, it was hidden from other potential consumers. This prevented multiple Lambda invocations from trying to process the same message at the same time.

I set the visibility timeout to give my Lambda enough time (30 sec) to finish storing the order in DynamoDB and logging the result. Without this timeout, if Lambda crashed or took too long, SQS could have retried it too early — leading to duplicate processing or errors.

### 🛑 Dead-Letter Queue (DLQ)

The DLQ was especially helpful during debugging. When something failed inside my Lambda function — like a missing field or a permissions issue — the message was retried 3 times (as configured), and then moved to the DLQ.

This helped me catch and inspect bad messages that were causing repeated failures. Instead of losing those orders or clogging up the system, they were safely stored in the DLQ for later review.

In short, visibility timeout and DLQ gave my system more reliability, prevented message loss, and made debugging much easier.

- Basma
