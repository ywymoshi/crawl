const app = new Vue({
  el: "#app",
  data() {
    return {
      statusText: false,
      form: {
        username: '',
        pwd: ''
      },
      auth: {
        onceSign: false,
        token: '',
        user: {

        }
      },
      hint: {
        msg: '',
        timer: null,
        isShow: false,
        status: true
      },
      isManageMenu:false,
      isHeadActive: false,
      isMenuActive: true,
      isLoading: false,
      isActive: 326,
      isLessonActive: 4053,
      courseLessons: [],
      currentSection: 0,
      currentLesson: 0,
      isManage: false,
      courses: [],
      lessons: [{
        textContent: ''
      }],
      url: './',
    }
  },
  methods: {
    toLogin() {
      if (this.auth.token) {
        this.isManageMenu = !this.isManageMenu;

      } else {
        this.auth.onceSign = true;
      }
    },
    login() {
      axios.post(`${this.url}user/login`, {username: this.form.username, pwd: this.form.pwd}).then(res => {
        let {data, msg, code} = res.data;
        if (code === 0) {
          localStorage.setItem('authorization', res.data.token)
          this.auth.token = res.data.token;
          this.auth.onceSign = false;
          this.statusText = true;
          this.showMsg(msg, code)
        } else {
          this.showMsg(msg, code)
        }
      })
    },
    async getUserInfo() {
      let res = await axios.get(`${this.url}user/getUserInfo`);
      return res.data;
    },
    updateCourse(id) {
      this.isLoading = true;
      this.hint.isShow = false;
      axios.post(`${this.url}course/updateCourse`, {id: id}).then(res => {
        let {code, msg} = res.data;
        if (code === 0) {
          this.isLoading = false;
          this.showMsg(msg, code);
          this.goCourse(id)
        }
      })
    },
    updateAllCourse (){
      this.isLoading = true;
      axios.post(`${this.url}course/updateAllCourse`).then(res => {
        let {code, msg} = res.data;
        if (code === 0) {
          this.isLoading = false;
          this.showMsg(msg, code);
          this.getCourseLessons();
        }
      })
    },
    showMsg(msg, code) {
      if (code === 0) {
        this.hint.status = true;
      } else {
        this.hint.status = false;
      }
      this.hint.timer = null;
      this.hint.msg = msg;
      this.hint.isShow = true;
      this.hint.timer = setTimeout(() => {
        this.hint.isShow = false;
        this.hint.timer = null;
      }, 2000)
    },
    showCourse() {
      this.isHeadActive = !this.isHeadActive;
    },
    prevLesson() {
      if (this.currentLesson === 0) {
        if (this.currentSection !== 0) {
          this.currentSection--;
          let data = this.courses[this.currentSection]["courseLessons"];
          this.currentLesson = data.length - 1;
        }
      } else {
        this.currentLesson--;
      }
      let {id, courseId} = this.courses[this.currentSection]["courseLessons"][this.currentLesson]
      this.goLesson(id, courseId);
    },
    nextLesson() {
      let data = this.courses[this.currentSection]["courseLessons"];
      if (this.currentLesson === data.length - 1) {
        this.currentSection++;
        this.currentLesson = 0;
      } else {
        this.currentLesson++;
      }
      let {id, courseId} = this.courses[this.currentSection]["courseLessons"][this.currentLesson]
      this.goLesson(id, courseId);
    },
    showManage() {
      this.isManage = !this.isManage;
    },
    getCourseLessons() {
      axios.get(this.url + 'courseLessons').then(res => {
        this.courseLessons = res.data;
        this.goCourse(res.data[0].id);
        // console.log("所有课程信息",this.courseLessons);
      })
    },
    goCourse(id) {
      this.isHeadActive = false;
      window.axios.get(`${this.url}course/course?id=${id}`).then(res => {
        this.courses = res.data;
        const data = res.data[0]["courseLessons"][0];
        this.goLesson(data["id"], data["courseId"]);
        this.isActive = data["courseId"]
        this.isLessonActive = data["id"]
        // console.log("单个课程所有目录信息",this.courses);
      })
    },
    goLesson(id, courseId) {
      window.axios.get(`${this.url}course/lesson?id=${id}&courseId=${courseId}`).then(res => {
        this.lessons = res.data;
        // console.log("单个目录信息",this.lessons );
      })
      this.isLessonActive = id;
    },
    changeCourse(id) {
      this.isManage = false;
      this.currentLesson = 0;
      this.currentSection = 0;
      this.goCourse(id);
    },
    async checkStatus() {
      let token = localStorage.getItem('authorization');
      if (token) {
        window.axios.defaults.headers['authorization'] = token;
        let {data, msg, code} = await this.getUserInfo(token);
        // console.log(data,msg,code)
        if (data) {
          this.auth.token = token;
          this.auth.user = data;
          this.statusText = true;
        }
      }
    }
  },
  computed: {
    checkLogin() {
      return this.auth.onceSign;
    }
  },
  created() {
    this.checkStatus();
    let clientX = document.body.clientWidth;
    if (clientX <= 1200) {
      this.isMenuActive = false;
    }
    this.getCourseLessons();
  }
})
