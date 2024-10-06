class PriorityQueue {
    constructor() {
        this.items = [];
    }

    enqueue(item, priority) {
        const queueElement = { item, priority };
        let added = false;

        for (let i = 0; i < this.items.length; i++) {
            // Enqueue in order of priority
            if (queueElement.priority < this.items[i].priority) {
                this.items.splice(i, 0, queueElement);
                added = true;
                break;
            }
        }

        // If not added, push it to the end
        if (!added) {
            this.items.push(queueElement);
        }
    }

    dequeue() {
        return this.items.shift(); // Remove and return the highest priority element (front of the queue)
    }

    front() {
        return this.items[0]; // Return the highest priority element without removing it
    }

    isEmpty() {
        return this.items.length === 0; // Check if the queue is empty
    }

    reset() {
        this.items = []; // Clear the queue
    }
}
