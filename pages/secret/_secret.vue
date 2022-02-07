<template>
  <div class="container">
    <div>
      <h1 class="title">
        Your secret
      </h1>
      <div>
        <h2>
          text of the secret: {{ secret.secretText }}
        </h2>
      </div>
      <div v-if="secret.createdAt">
        <h2>secret created at: {{ secret.createdAt }}</h2>
      </div>
      <div>
        <div v-if="secret.expiresAt">
          <h2>secret can be viewed until: {{ secret.expiresAt }}</h2>
        </div>
      </div>
      <div>
        <div v-if="secret.remainingViews > 0">
          <h2>
            secret can be accessed for: {{ secret.remainingViews }} times
          </h2>
        </div>
        <div v-if="secret.remainingViews === 0">
          <h2>
            secret can be accessed for unlimited times
          </h2>
        </div>
        <nuxt-link to="/">
          Home
        </nuxt-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Secret',
  data () {
    return {
      hash: this.$route.params.secret,
      secret: {}
    }
  },
  mounted () {
    this.getSecret()
  },
  methods: {
    resetSecret () {
      this.secret = {
        secretText: 'This secret no longer exists'
      }
    },
    getSecret () {
      fetch(`${process.env.baseUrl}/api/secret/${this.hash}`, {
        method: 'GET'
      })
        .then(res => res.json())
        .then((res) => {
          if (res !== undefined) {
            this.secret = res
          }
        })
        .catch(() => {
          this.resetSecret()
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

h2 {
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
  font-weight: 100;
  font-size: 25px;
  color: #35495e;
  letter-spacing: 1px;
}

</style>
