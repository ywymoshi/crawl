const axios = require('../util/axios');
const {lessonUrl} =require('../util/config');
const course = require('../model/course');
const lesson = require('../model/lesson');
console.log("课程详细信息正在爬取");
(async ()=> {
  const courses =await course.findLesson({},function(err,result){
    if(err)
      return "err";
    return result;
  })

  let data = null;
  let lessonData =null;
  let a = null;
  for(let i = 0; i < courses.length; i++){
      for(let j = 0; j < courses[i]["courseLessons"].length; j++){
        try{
         a = await lesson.findLesson(

          {id:courses[i]["courseLessons"][j]["id"],
            courseId:courses[i]["courseLessons"][j]["courseId"],
            sectionId:courses[i]["courseLessons"][j]["sectionId"]});
            if(a.length>0){
              continue;
            }
           data = await axios.get(lessonUrl+courses[i]["courseLessons"][j]["id"]);
            if(!data){
              j--;
              continue;
            }
           lessonData =  data.data.content;
          await lesson.add(lessonData);
      }catch (e) {
        console.log("课程详细信息爬取出错")
        console.log('err',e,i,j);
          return;
      }
      }
    }
})();
console.log("课程详细信息爬取完成");
module.exports = 3;
