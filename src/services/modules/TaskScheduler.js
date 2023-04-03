function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

class Task {

    constructor(task, params) {
        this._task = task
        this._params = params
        this._thread = null
        this.isRunning = false
        this.finished = false
        this.result = null
    }

    async run() {
        if (this.isRunning || this.finished) {
            return
        }

        const isAsync = this._task.constructor.name === "AsyncFunction"
        this._thread = new Promise(async (resolve) => {
            this.isRunning = true
            let result
            if (isAsync) {
                result = await this._task(...this._params)
            } else {
                result = this._task(...this._params)
            }
            this.result = result
            resolve()
        }).finally(() => {
            this._thread = null
            this.finished = true
            this.isRunning = false
        }).catch((error) => {
            console.error(error)
        })

        return this._thread
    }

    async cancel() {
        if (this._thread) {
            this._thread.cancel()
            this._thread = null
        }
    }

}

class TaskScheduler {

    constructor(data) {
        data = data || {}
        this.maxTasks = data.maxTasks || 1
        this.taskDelay = data.taskDelay || 0
        this._runningTasks = []
        this._pendingTasks = []
    }

    async _executeTask(task) {
        const pendingTaskIndex = this._pendingTasks.indexOf(task)
        if (pendingTaskIndex > -1) {
            this._pendingTasks.splice(pendingTaskIndex, 1)
        }

        this._runningTasks.push(task)
        task.run().finally(async () => {
            await sleep(this.taskDelay*1000)
            
            const runningTaskIndex = this._runningTasks.indexOf(task)
            if (runningTaskIndex > -1) {
                this._runningTasks.splice(runningTaskIndex, 1)
            }

            if (this._pendingTasks.length >= 1) {
                this._executeTask(this._pendingTasks[0])
            }
        })
    }

    async addTask(task, ...params) {
        task = new Task(task, params)

        if (this._runningTasks.length >= this.maxTasks) {
            this._pendingTasks.push(task)
        } else {
            this._executeTask(task)
        } 

        return task
    }
    
}

export default TaskScheduler