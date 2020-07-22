const Router = require('koa-router');

const router = new Router({prefix: '/course'});
const courseLesson = require('../model/courseLesson');
const course = require('../model/course');
const lesson = require('../model/lesson');
const axios = require('../util/axios');
const {courseUrl, lessonUrl} = require('../util/config');

router.get("/course", async ctx => {
  const {id} = ctx.query;
  const data = await course.findOne({courseId: id});
  ctx.body = data
});
router.get("/lesson", async ctx => {
  const {id, courseId} = ctx.query;
  const data = await lesson.findOne({id: id, courseId: courseId});
  ctx.body = data
});
router.post("/updateCourse", async ctx => {
  const {id} = ctx.request.body;
  const courses = await course.findOne({courseId:id});
  let netCourse = await axios.get(courseUrl + id);
  console.log(netCourse);
  let sign = null;
  let data = null;
  let lessonId = null;
  let courseId = null;
  let lessonData = null;
  console.log("开始更新");
  try {
    for (let i = 0; i < netCourse.length; i++) {
      if (i >= courses.length) {
        await course.add(netCourse[i])
      }
      for (let j = 0; j < netCourse[i]["courseLessons"].length; j++) {
        if (j >= courses[i]["courseLessons"].length) {
          lessonId = netCourse[i]["courseLessons"][j]["id"];
          data = await axios.get(lessonUrl + lessonId);
          //获取数据失败重新获取
          if (!data) {
            j--;
            continue;
          }
          lessonData = data.data.content;
          await lesson.add(lessonData);
        }
        if (courses[i]["courseLessons"][j].status === 'RELEASE') {
          continue;
        }
        if (netCourse[i]["courseLessons"][j].status === 'RELEASE' && courses[i]["courseLessons"][j].status !== 'RELEASE') {
          lessonId = netCourse[i]["courseLessons"][j]["id"];
          courseId = netCourse[i]["courseLessons"][j]["courseId"]
          data = await axios.get(lessonUrl + lessonId);
          //获取数据失败重新获取
          if (!data) {
            j--;
            continue;
          }
          lessonData = data.data.content;
          await lesson.update(lessonId, courseId, lessonData);
        }
      }
    }
  } catch (e) {
    console.log("更新出错");
    console.log(e)
  }
  console.log("更新完成")
  ctx.body = {
    code:1,
    msg:"更新完成"
  };
});

module.exports = router;
