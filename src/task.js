class Task {
	state = "ready";

	isRunning() {
		return Boolean(this.running);
	}

	isReady() {
		return Boolean(this.state === 'state');
	}

	isDone() {

	}

	isTimeout() {

	}

	isFailed() {

	}

	run () {

	}
}

export default Task;