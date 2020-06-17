import axios from "axios"
import helpapify from "@/helpers/apify"
import db from "@/helpers/localdb"
import {pr,is_undefined, get_error, is_defined} from "@/helpers/functions"

let BASE_URL = "https://dbsapify.theframework.es"
BASE_URL = "https://dbsapify.theframework.es"
BASE_URL = "http://localhost:3000"

const Apidb = {
  
  async_get_fields: async (table) =>{
    const usertoken = db.select("usertoken")
    const url = `${BASE_URL}/apify/fields/c3/db_security/${table}`

    try{
      const objform = new FormData()
      objform.append("apify-usertoken",usertoken)
      const fields = await axios.post(url,objform)
      //pr(fields,"alert fields:")
      if(is_undefined(fields.data.data))
        throw new Error("Wrong data received from server. Get fields")
      return fields.data.data
    }
    catch (e) {
      console.error("ERROR: apidb.async_get_fields.url:",url,"e:",e)
      return get_error(e)
    }    
  },

  async_get_list: async objselect => {
    const usertoken = db.select("usertoken")
    //const url = `${BASE_URL}/apify/read?context=c3&dbname=dbs433062`
    const url = `${BASE_URL}/apify/read?context=c3&dbname=db_security`

    //hay que enviar header: apify-auth: token
    try {
   
      const objform = objselect.get_query()
      objform.append("apify-usertoken",usertoken)

      console.log("apidb.async_get_list",url)
      const response = await axios.post(url, objform)

      console.log("apidb.async_get_list.response",response)

      if(is_undefined(response.data.data))
        throw new Error("Wrong data received from server. Resultset")

      return response.data.data
    } 
    catch (e) {
      console.error("ERROR: apidb.async_get_list.url:",url,"e:",e)
      return get_error(e)
    }
  },

  async_insert: async (objinsert) => {
    const usertoken = db.select("usertoken")
    const url = `${BASE_URL}/apify/write?context=c3&dbname=db_security`

    try {
      const objform = objinsert.get_query()
      objform.append("apify-usertoken",usertoken)

      console.log("apidb.async_insert",url)
      const response = await axios.post(url, objform)
      //pr(response,"async_insert")
      console.log("apidb.async_insert.response",response)

      if(is_undefined(response.data.data.lastid))
        throw new Error("Wrong data received from server. insert lastid")
      //alert(JSON.stringify(response.data.data)) esto viene con result: las filas, y numrows: el total
      return response.data.data.lastid
    } 
    catch (e) {
      console.error("ERROR: apidb.async_insert.url:",url,"e:",e)
      return get_error(e)
    }
  },

  async_update: async (objupdate) => {
    const usertoken = db.select("usertoken")
    const url = `${BASE_URL}/apify/write?context=c3&dbname=db_security`
    //hay que enviar header: apify-auth: token
    try {
 
      const objform = objupdate.get_query()
      objform.append("apify-usertoken",usertoken)

      console.log("apidb.async_update",url)
      const response = await axios.post(url, objform)

      console.log("apidb.async_update.response",response)

      if(is_undefined(response.data.data.result))
        throw new Error("Wrong data received from server. Update result")
      //alert(JSON.stringify(response.data.data)) esto viene con result: las filas, y numrows: el total
      return response.data.data.result
    } 
    catch (e) {
      console.error("ERROR: apidb.async_update.url:",url,"e:",e)
      return get_error(e)
    }
  },

  async_delete: async(objdelete) => {

    const usertoken = db.select("usertoken")
    const url = `${BASE_URL}/apify/write?context=c3&dbname=db_security`

    try {
      const objform = objdelete.get_query()
      objform.append("apify-usertoken",usertoken)

      console.log("apidb.async_delete",url)
      const response = await axios.post(url, objform)

      console.log("apidb.async_delete.response",response)
      //devuelve el num de registros afectados
      if(is_undefined(response.data.data.result))
        throw new Error("Wrong data received from server. Delete result")
      //alert(JSON.stringify(response.data.data)) esto viene con result: las filas, y numrows: el total
      return response.data.data.result
    } 
    catch (e) {
      console.error("ERROR: apidb.async_delete.url:",url,"e:",e)
      return get_error(e)
    }
  }, //async_delete

}//Apidb


export default Apidb;