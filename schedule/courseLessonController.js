const axios = require('../util/axios');
const {courseLessonUrl} =require('../util/config');
const courseLesson = require('../model/courseLesson');

console.log("所有课程信息正在爬取....");
(async ()=>{
  try{
    const res = await axios.get(courseLessonUrl);

    const courseRecordList = res.data.content.allCoursePurchasedRecord[1]["courseRecordList"];

    let a = null;
    for(let i = 0; i < courseRecordList.length; i++){
      a = await courseLesson.findCourseLesson({id:courseRecordList[i]["id"]});
      if(a.length>0){
        continue;
      }else{
        await courseLesson.add(courseRecordList[i])
      }
    }
  }catch (e) {
    console.log("所有课程信息爬取出错，请重新尝试",e);
  }
})();
console.log("所有课程信息爬取完成");
module.exports = 1;
