<template>
  <div class="container">
    <div>
      <Logo />
      <h1 class="title">
        secret vault
      </h1>
      <h3>Create your secret</h3>
      <form
        accept-charset="UTF-8"
        method="POST"
        @submit.prevent="onSubmit"
      />
      <div>
        <label>secret</label>
        <input
          v-model="secretMessage"
          type="text"
          class="form-control"
          placeholder="something you'd hide"
          required="required"
        >
      </div>
      <div>
        <label>Expire after number of views, leave if shouldn't expire</label>
        <input v-model="expireAfterViews" type="number" value="0" class="form-control">
      </div>
      <div>
        <label>Expiration time: the secret will expire after (in minutes)</label>
        <input v-model="expireAfter" type="number" required="required">
      </div>
      <div>
        <input type="submit" value="save" @click="sendSecret">
      </div>
      <div v-if="secretHash">
        <h2>{{ secretHash }}</h2>
      </div>
      <Secret />
      <div />
    </div>
  </div>
</template>

<script>
import Secret from '~/pages/secret/Secret'

export default {
  components: { Secret },
  data () {
    return {
      secretHash: '',
      secretMessage: '',
      expireAfterViews: 0,
      expireAfter: 0
    }
  },
  methods: {
    async sendSecret () {
      const response = await fetch(`${process.env.baseUrl}/api/secret/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        redirect: 'follow',
        body: JSON.stringify({
          secret: this.secretMessage,
          expireAfter: this.expireAfter,
          expireAfterViews: this.expireAfterViews
        })
      })
      this.secretHash = response.hash
    }
  }
}
</script>

<style scoped>
.container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.title {
  font-family: 'Quicksand',
  'Source Sans Pro',
  -apple-system,
  BlinkMacSystemFont,
  'Segoe UI',
  Roboto,
  'Helvetica Neue',
  Arial,
  sans-serif;
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #35495e;
  letter-spacing: 1px;
}

.links {
  padding-top: 15px;
}
</style>
