const axios = require('../util/axios');
const {courseUrl} =require('../util/config');
const courseLesson = require('../model/courseLesson');
const course = require('../model/course');

console.log("课程目录正在爬取");
(async ()=>{
  const courseLessons = await courseLesson.findCourseLesson({},function(err,result){
    if(err)
      return err;
    return result;
  })
  let data = null;
  let courseSectionList =null;
  let a = null;
  try{
    for(let i = 0; i < courseLessons.length; i++){
       data = await axios.get(courseUrl + courseLessons[i]["id"]);
      if(!data){
       i--;
        continue;
      }
       courseSectionList = data.data.content.courseSectionList;
      for(let j = 0; j < courseSectionList.length; j++){
         a = await course.findCourse({id:courseSectionList[j]["id"],courseId:courseLessons[i]["id"]});
        if(a.length>0){
          continue;
        }else{
          await course.add(courseSectionList[j])
        }
      }
    }
  }catch (e) {
    console.log("课程目录爬取出错");
    console.log('err',i,j)
  }
})();
console.log("课程目录爬取成功");
module.exports = 2;
