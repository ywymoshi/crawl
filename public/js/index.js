const app = new Vue({
  el: "#app",
  data() {
    return {
      statusText: false,
      form:{
        username:'',
        pwd:''
      },
      auth:{
        onceSgin:false,
        token:''
      },
      isHeadActive:false,
      isMenuActive:true,
      isLoading:false,
      isActive: 326,
      isLessonActive: 4053,
      courseLessons: [],
      currentSection:0,
      currentLesson:0,
      isManage:false,
      courses: [],
      lessons: [{
        textContent: ''
      }],
      url: './',
    }
  },
  methods: {
    toLogin(){
      if(this.auth.token){
        return;
      }else{

        this.auth.onceSgin = true;
      }
    },
    login(){
      window.axios.post(`${this.url}user/login`,{ username : this.form.username,pwd:this.form.pwd }).then(res => {
        window.localStorage.setItem('authorization',res.data.token)
        this.auth.token  = res.data.token;
      })
    },
    async getUserInfo (){
      let {data} = window.axios.get(`${this.url}user/getUserInfo`);
      console.log(data);
      return data;
      // window.localStorage.setItem('authorization',data.token)
    },
    updateCourse(id){
      this.isLoading = true;
      window.axios.post(`${this.url}course/updateCourse`,{ id : id }).then(res => {
        if(res.data.code === 1){
          this.isLoading = false;
        }
      })
    },
    showCourse(){
      this.isHeadActive = !this.isHeadActive;
    },
    prevLesson(){
      if(this.currentLesson === 0){
        if(this.currentSection !== 0){
          this.currentSection --;
          let data = this.courses[this.currentSection]["courseLessons"];
          this.currentLesson = data.length - 1;
        }
      }else{
        this.currentLesson --;
      }
      let {id,courseId} = this.courses[this.currentSection]["courseLessons"][this.currentLesson]
      this.goLesson(id,courseId);
    },
    nextLesson(){
      let data = this.courses[this.currentSection]["courseLessons"];
      if(this.currentLesson === data.length -1){
        this.currentSection ++;
        this.currentLesson = 0;
      }else{
        this.currentLesson ++;
      }
      let {id,courseId} = this.courses[this.currentSection]["courseLessons"][this.currentLesson]
      this.goLesson(id,courseId);
    },
    showManage(){
      this.isManage = !this.isManage;
    },
    getCourseLessons() {
      window.axios.get(this.url + 'courseLessons').then(res => {
        this.courseLessons = res.data;
        this.goCourse(res.data[0].id);
        // console.log("所有课程信息",this.courseLessons);
      })
    },
    goCourse(id) {
      this.isHeadActive = false;
      this.isActive = id;
      window.axios.get(`${this.url}course/course?id=${id}`).then(res => {
        this.courses = res.data;
        const data = res.data[0]["courseLessons"][0];
        this.goLesson(data["id"], data["courseId"]);
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
    changeCourse(id){
      this.isManage = false;
      this.currentLesson = 0;
      this.currentSection = 0;
      this.goCourse(id);
    },
    checkStatus(){
      let token = localStorage.getItem('authorization');
      if(token){
        this.statusText = true
        window.axios.defaults.headers['authorization'] = token;
        let tok = this.getUserInfo (token);
      }else{
        this.auth.onceSgin
      }
    }
  },
  computed:{
    checkLogin(){
      return this.auth.token && this.auth.onceSgin;
    }
  },
  created() {
    this.checkStatus();
    this.getCourseLessons();
  }
})
