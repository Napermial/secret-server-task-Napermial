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
        <input class="button" type="submit" value="save" @click="sendSecret">
      </div>
      <div v-if="secretHash">
        <h2>you can send this link to share your sercet:</h2>
        <br>
        <h4>{{ secretUrl }}</h4>
        <a class="button" :href="secretUrl">
          link
        </a>
      </div>
      <div />
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      secretHash: '',
      secretMessage: '',
      expireAfterViews: 0,
      expireAfter: 0,
      secretUrl: ''
    }
  },
  methods: {
    sendSecret () {
      this.secretUrl = process.env.baseUrl + '/secret/'
      fetch(`${process.env.baseUrl}/api/secret/`, {
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
      }).then((response) => {
        return response.json()
      }).then((res) => {
        this.secretHash = res.hash
        this.secretUrl += this.secretHash
      }).catch((r) => {
        // eslint-disable-next-line no-console
        console.error(r)
      })
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

.button {
  background-color: #e7e7e7;
  color: black;
  border: none;
  padding: 15px 32px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
}

</style>
