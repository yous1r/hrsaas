export default {
  // 这个对象中可以包含组件中的任意的配置，将来可以混到组件中
  // created() {
  //   this.hello()
  // },
  // data() {
  //   return {
  //     money: 100
  //   }
  // },
  // methods: {
  //   hello() {
  //     console.log('大家好，我有' + this.money)
  //   }
  // }
  methods: {
    checkPermission(key) {
      // 获取到vuex中的数据
      const points = this.$store.state.user.userInfo.roles.points
      return points.includes(key)
    }
  }
}
