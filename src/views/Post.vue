<template>
  <section class="post-view">
    <div v-if="!content">loading..</div>
    <h1 class="post-title">
      {{ title }}
      <time pubdate="pubdate" :datetime="this.date | formatDate" :title="this.date | formatDate" class="post-date">{{ this.date | timeago }}</time>
    </h1>
    <article v-if="content" v-html="htmlFromMarkdown"></article>
  </section>
</template>

<script>
/* eslint no-undef:0 */
import Vue from 'vue'
import api from '../api'
import conf from '../config'
import fm from 'front-matter'
import marked from '../utils/render.js'
import store from '../vuex/store'
import Prism from '../../external/prism'

const adoc = Asciidoctor()
export default {
  name: 'postView',
  store,
  data () {
    return {
      title: '',
      type: 'adoc',
      date: null,
      content: ''
    }
  },

  computed: {
    htmlFromMarkdown () {
      return this.type === 'md' ? marked(this.content) : adoc.convert(this.content,
        {attributes: { showtitle: true, toc: 'right', imagesdir: `https://raw.githubusercontent.com/${conf.repo}/${conf.branch}/${conf.path}`, 'source-highlighter': 'prismjs' }})
    }
  },

  created () {
    this.loadPost()
  },

  updated () {
    if (this.type !== 'md') {
      Prism.highlightAll()
    }
  },

  methods: {
    loadPost () {
      const hash = this.$route.params.hash
      store.dispatch('getList').then(() => {
        const item = store.state.lists.find(it => it.sha === hash)
        this.type = item.type
        console.log(item)
        api.getDetail(hash)
          .then(text => {
            // Parse front-matter
            // https://github.com/jxson/front-matter#fmstring
            const content = fm(text)
            this.content = content.body
            this.title = content.attributes.title
            this.date = content.attributes.date
            // Set window title
            window.document.title = `${this.title} - ${conf.blogTitle}`
          })
          .catch(err => {
            console.error('[getDetail]', err)
            this.$router.replace('/')
          })
      })
    },

    newTab () {
      Vue.nextTick(function () {
        // Load the external link into new tab
        const linksArray = [...document.querySelectorAll('a')]
        const currentHost = window.location.host
        linksArray.forEach(el => {
          if (el.href && el.host !== currentHost) {
            el.target = '_blank'
            // https://www.jitbit.com/alexblog/256-targetblank---the-most-underestimated-vulnerability-ever/
            el.rel = 'noopener noreferrer'
          }
        })
      })
    }
  },

  watch: {
    'htmlFromMarkdown': 'newTab'
  }
}
</script>
