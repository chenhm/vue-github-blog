<template>
  <section class="post-view">
    <article v-if="content" v-html="htmlFromMarkdown"></article>
    <div v-else class="md">
      <slot/>
    </div>
  </section>
</template>
<style scoped>
.md{
  display: none;
}
</style>
<script>
import marked from '../utils/render.js'
export default {
  data () {
    return {
      content: ''
    }
  },
  computed: {
    htmlFromMarkdown () {
      return marked(this.content)
    }
  },
  mounted () {
    this.content = this.$el.querySelector('div.md').innerText
  }
}
</script>
