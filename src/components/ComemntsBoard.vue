<template>
    <ul class="comments">
        <li v-for="comment in comments" :key="comment.id" class="comment">
             {{comment.text}}
            <div class="row">
                <div class="col row__col"> <strong>{{comment.author}}</strong></div>
                <div class="col row__col">
                    <button v-if="!comment.pending" @click="deleteComment(comment.id)" class="delete">Delete</button>
                    <span v-else>Pending...</span>
                </div>
            </div>
        </li>
    </ul>
</template>

<script>
export default {
    data() {
        return {
            ws: null, 
            comments: {
                '0': {
                    id: '0',
                    text: 'What a story, mark',
                    author: 'Mike',
                    pending: false
                },
                '1': {
                    id: '1',
                    text: 'Nice article',
                    author: 'Kyle',
                    pending: false
                },
                '2': {
                    id: '2',
                    text: 'Well, nothing new to me',
                    author: 'John',
                    pending: false
                },
                '3': {
                    id: '3',
                    text: 'A W E S O M E :)',
                    author: 'Jean',
                    pending: false
                },
            },
            requestCounter: 1,
            requests: {},
            pendingTimeout: 3000
        }
    },
    methods: {
        deleteComment(commentId) {
            const requestId = this.requestCounter

            this.comments[commentId].pending = true
            this.ws.send(requestId)

            this.$set(this.requests, requestId, {
                requestId,
                commentId
            })

            this.requestCounter++ 

            /** 
             * If server doesn't respond in time, we stop waiting
             * and remove the request from the table
            */
            setTimeout(() => {
                if(this.requests[requestId]) this.$delete(this.requests, requestId)
                if(this.comments[commentId]) this.comments[commentId].pending = false
            }, this.pendingTimeout)
        },
        handleMessage(msg) {
            const requestId = msg.data
            const request = this.requests[requestId] 

            if(!request) return 

            if(this.comments[request.commentId] && this.comments[request.commentId].pending) {
                this.$delete(this.comments, request.commentId)
            }

            this.$delete(this.requests, requestId)
        }
    },
    created() {
        this.ws = new WebSocket('ws://echo.websocket.org/')
        this.ws.onmessage = this.handleMessage
    },
    destroyed() {
        this.ws.close()
    }
}
</script>

<style>
.comments {
    max-width: 400px;
}
.comment {
    padding: 1.5rem;
}
.delete {
    padding: 0;
    margin: 0;
    color: #f00;
    cursor: pointer;
}
.row {
    margin-top: 0.5rem;
}
</style>
