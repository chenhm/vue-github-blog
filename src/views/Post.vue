<template>
  <section class="post-view">
    <div v-if="loading">loading..</div>
    <h1 v-if="title" class="post-title">
      {{ title }}
      <time pubdate="pubdate" :datetime="this.date | formatDate" :title="this.date | formatDate" class="post-date">{{ this.date | timeago }}</time>
    </h1>
    <article v-if="!loading" v-html="htmlFromMarkdown"></article>
    <section class="comment">
      <div id="disqus_thread"></div>
    </section>
  </section>
</template>

<script>
/* eslint no-undef:0 */
import Vue from 'vue'
import conf from '../config'
import fm from 'front-matter'
import marked from '../utils/render.js'
import store from '../vuex/store'
import Prism from '../../external/prism'
import { script } from '../utils'

export default {
  name: 'postView',
  store,
  data () {
    return {
      title: '',
      type: '',
      date: null,
      loading: true,
      content: ''
    }
  },

  asyncComputed: {
    htmlFromMarkdown: {
      async get () {
        if (this.content) this.loading = false
        if (this.type === 'md') {
          return marked(this.content)
        } else if (this.type === 'adoc') {
          if (typeof Asciidoctor === 'undefined') {
            await script('https://cdnjs.cloudflare.com/ajax/libs/asciidoctor.js/1.5.6-preview.5/asciidoctor.js')
          }
          const adoc = Asciidoctor()
          return adoc.convert(this.content,
            {attributes: { showtitle: true, toc: 'right', imagesdir: `https://raw.githubusercontent.com/${conf.repo}/${conf.branch}/${conf.path}`, 'source-highlighter': 'prismjs' }})
        }
      },
      watch () {
        return this.content
      }
    }
  },

  created () {
    this.loadPost()
    // setTimeout(() => {
    //   let d = document
    //   let s = document.createElement('script')
    //   s.setAttribute('id', 'embed-disqus')
    //   s.setAttribute('data-timestamp', +new Date())
    //   s.type = 'text/javascript'
    //   s.async = true
    //   s.src = `//${conf.disqus_shortname}.disqus.com/embed.js`
    //   if (typeof (DISQUS) === 'undefined') {
    //     (d.head || d.body).appendChild(s)
    //   } else {
    //     DISQUS.reset({ reload: true })
    //   }
    // }, 0)
  },

  updated () {
    if (this.type !== 'md') {
      Prism.highlightAll()
    }
  },

  methods: {
    loadPost () {
      const id = this.$route.params.id
      store.dispatch('getList').then(() => {
        const item = store.state.lists.find(it => it.id === id)
        if (item) {
          this.type = item.type
          const href = item.download_url
          const hash = item.sha
          store.dispatch('getDetail', {sha: hash, url: href, type: this.type})
            .then(text => {
            // Parse front-matter
            // https://github.com/jxson/front-matter#fmstring
              const content = fm(text)
              this.content = content.body
              this.date = content.attributes.date
              this.title = content.attributes.title
              // Set window title
              window.document.title = `${item.title} - ${conf.blogTitle}`
            })
            .catch(err => {
              console.error('[getDetail]', err)
              this.$router.replace('/')
            })
        } else {
          console.error('[getDetail]', 'Cant found post id')
        }
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
