<template>
  <section class="post-view">
    <article v-if="content" v-html="htmlFromMarkdown"></article>
    <textarea class="md">
    ## Chen Hongming ##

    A Programmer

    GitHub:
    > <https://github.com/chenhm>

    500px:
    > <http://500px.com/chenhm>

    Lofter:
    > [http://coldlight.lofter.com](http://coldlight.lofter.com/?mydomainr=true)
  </textarea>
  </section>
</template>
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
    this.content = document.querySelector('textarea.md').value
  }
}
</script>

