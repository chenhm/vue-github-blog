<template>
  <footer class="footer">
    Copyright © {{ thisYear }} | Powered by <a href="https://github.com/chenhm/vue-github-blog" target="_blank">vue-github-blog</a>
  </footer>
</template>

<script>
  export default {
    data () {
      return {
        thisYear: new Date().getFullYear()
      }
    }
  }
</script>
