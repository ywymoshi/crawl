/**
 * Created by prettyRain on 2018/12/24.
 * course骨架
 * model : 由Schema构造生成的模型，除了Schema定义的数据库骨架以外，
 *         还具有数据库操作的行为，类似于管理数据库属性、行为的类
 */

var mongoose = require('mongoose');

var db = require('../db/db.js');
/**
 * schema :一种以文件形式存储的数据库模型骨架，无法直接通往数据库端，也就
 *         是说它不具备对数据库的操作能力.可以说是数据属性模型(传统意义的
 *         表结构)，又或着是“集合”的模型骨架
 */
var Schema = mongoose.Schema;
var courseSchema = new Schema({
  courseId : {type:Number},
  id: {type:Number},
  courseLessons  : {type:Array},
  sectionName  : {type:String},
})
/**
 * 自定义类方法
 */
//插入数据
courseSchema.statics.add = function(paramJSON = {}){
  return  new Promise((resolve,reject) => {
    this.model('course').create(paramJSON,function (err,result) {
      if (err)
        reject(err)
      resolve(result)
    });//类方法
  })
}
//查询数据
courseSchema.statics.findAll = function(paramJSON = {}){
  return  new Promise((resolve,reject) => {
    this.model('course').find(paramJSON,function (err,result) {
      if (err)
        reject(err)
      resolve(result)
    });//类方法
  })
}
courseSchema.statics.findOne = function(paramJSON = {}){
  return  new Promise((resolve,reject) => {
    this.model('course').find(paramJSON,function (err,result) {
      if (err)
        reject(err)
      resolve(result)
    });//类方法
  })
}
courseSchema.statics.remove = function(paramJSON = {}){
  return  new Promise((resolve,reject) => {
    this.model('course').remove(paramJSON,function (err,result) {
      if (err)
        reject(err)
      resolve(result)
    });//类方法
  })
}

var course = db.model('course',courseSchema);

module.exports = course;
