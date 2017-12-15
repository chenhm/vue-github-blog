<template>
  <section class="list-view">
    <div class="loading" v-if="loading">loading..</div>
    <div class="no-content" v-else-if="filteredList.length === 0">nothing..</div>
    <ol v-else class="list">
      <li v-for="{ title, sha, date } in filteredList" :key="sha" class="list-item">
        <time pubdate="pubdate" :datetime="date | formatDate" :title="date | formatDate" class="item-date">{{date}} | {{ date | timeago }}</time>
        <router-link :to="'/post/' + sha" class="item-title">
          {{ title }}
        </router-link>
      </li>
    </ol>

    <div id="post-pagination" class="paginator">
      <router-link :to="'/list/' + previousPage">&lt;前页</router-link>
      <router-link v-for="n in pages" :key="n" :to="'/list/' + n" v-bind:class="{'current-page': n == currentPage}">{{n}}</router-link>
      <router-link :to="'/list/' + nextPage">后页&gt;</router-link>(共 {{lists.length}} 篇)
    </div>
  </section>
</template>

<script>
import api from '../api'
import conf from '../config'

const pageSize = 10

export default {
  name: 'listView',

  data () {
    return {
      lists: [],
      pages: 0,
      loading: true
    }
  },

  computed: {
    currentPage () {
      return this.$route.params.page || 1
    },
    previousPage () {
      if (this.currentPage > 1) {
        return this.currentPage - 1
      } else {
        return 1
      }
    },

    nextPage () {
      console.log(this.pages)
      if (this.currentPage < this.pages) {
        return Number(this.currentPage) + 1
      } else {
        return this.pages
      }
    },

    filteredList () {
      let keyword = ''
      if (this.$route) {
        keyword = (this.$route.query.q || '').toLowerCase()
      }
      // Filter by title, Order by publish date, desc
      let ret = this.lists
        .filter(item => item.title.toLowerCase().indexOf(keyword) !== -1)
        .sort((itemA, itemB) => new Date(itemB.date) - new Date(itemA.date))
      this.pages = Math.ceil(ret.length / pageSize)
      // console.log(this.pages)
      return ret.slice((this.currentPage - 1) * pageSize, this.currentPage * pageSize)
    }

  },
  mounted () {
    window.document.title = conf.blogTitle
    this.loadList()
  },

  methods: {
    loadList () {
      this.loading = true
      api.getList().then(
        lists => {
          this.loading = false
          this.lists = lists
        },
        err => {
          this.loading = false
          console.info('[getList]', err)
        }
      )
    }
  },

  watch: {
    $route: 'loadList'
  }
}
</script>
