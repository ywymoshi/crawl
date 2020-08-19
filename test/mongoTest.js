/***
 * 仅用于测试数据库语句
 */

const course = require('../model/course');
const lesson = require('../model/lesson');
(async ()=>{
   const data = await course.findOne({ "courseId": 326, "sectionId": 884,'id' : 4343});
  let isLesson = await lesson.findLesson(
    {id:4064,
      courseId:326
});
  // const data = await lesson.findOne({ id : 4180, courseId: 356});
 let a = await course.removeCourse({courseId: 416});
  // let index = 1;
  // let a =`courseLessons.${index}.status`;
  // const data =  await course.updateCourse({ "courseLessons": { $elemMatch: { id : 4180, courseId: 356} } }, {$set: {[a]:'UNRELEASE'}});
  // const data1 =  await course.updateCourse({ "courseLessons": { $elemMatch: { "courseId": 326, "sectionId": 882,'id' : 3} } }, {$set: {[a]:4053}});
  console.log(a)
  console.log(isLesson.length)
})()

