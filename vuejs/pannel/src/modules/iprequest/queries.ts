import helpapify from "@/helpers/apify"
import {is_defined, get_keys, isset, is_empty, is_key, pr} from "@/helpers/functions"

const objselect = helpapify.select

export const table = "app_ip_request"

export const config = [
  {
    table:{
      name: "app_ip_request",
      alias: "r",
      fields:[
        {name: "id", label:"Nº"},
        {name: "remote_ip", label:"Rem. IP"},
        {name: "insert_date", label:"Date"},
        {name: "domain", label:"Domain"},
        {name: "request_uri", label:"R. URI"},
        {name: "`get`", label:"GET"},
        {name: "post", label:"POST"},
      ]
    }
  },
  {
    table:{
      name: "app_ip_blacklist",
      alias: "bl",
      fields:[
        {name: "insert_date", label:"Date", alias:"bl_date"},
        {name: "reason", label:"Reason"},
      ]
    }
  },  
  {
    table:{
      name: "app_ip",
      alias: "i",
      fields:[
        {name: "country", label:"Country"},
        {name: "whois", label:"Whois"},
      ]
    }
  },  
]

const query = {
  fields:[
    "r.id",
    "r.remote_ip",
    "i.country",
    "i.whois",
    "r.domain",
    "r.request_uri",
    "r.`get`",
    "CASE WHEN r.`get`!='' THEN 'GET' ELSE '' END hasget",
    "r.post",
    "CASE WHEN r.`post`!='' THEN 'POST' ELSE '' END haspost",      
    "r.insert_date",
    "bl.insert_date bl_date",
    "bl.reason",
    "CASE WHEN bl.id IS NULL THEN '' ELSE 'INBL' END inbl",
  ],

  joins:[
    "LEFT JOIN app_ip_blacklist bl ON r.remote_ip = bl.remote_ip",
    "LEFT JOIN app_ip i ON r.remote_ip = i.remote_ip",
  ],

  where:[
    "i.whois NOT LIKE '%google%'",
    "i.whois NOT LIKE '%msn%'"
  ],
}

export const get_obj_list = (objparam={filters:{},page:{},orderby:{}})=>{

  objselect.reset()

  objselect.table = `${table} r`
  objselect.foundrows = 1 //que devuelva el total de filas
  objselect.distinct = 1  //que aplique distinct
  
  query.fields.forEach(fieldconf => objselect.fields.push(fieldconf))
  
  if(!is_empty(objparam.filters)){
    //pr(objparam.filters,"objparam.filter")
    const stror = objparam.filters.map(filter => `${filter.field} LIKE '%${filter.value}%'`).join(" OR ")
    //pr(stror,"stror")
    objselect.where.push(`(${stror})`)
  }

  if(!is_empty(query.joins)){
    query.joins.forEach(join => objselect.joins.push(join))
  }

  if(!is_empty(query.where)){
    query.where.forEach(cond => objselect.where.push(cond))
  } 

  objselect.limit.perpage = 1000
  objselect.limit.regfrom = 0
  if(!is_empty(objparam.page)){
    //pr(objparam.page,"page")
    objselect.limit.perpage = objparam.page.ippage
    objselect.limit.regfrom = objparam.page.ifrom
  }

  objselect.orderby.push("r.id DESC")
  //pr(objselect,"get_obj_list.objselect")
  return objselect
}//get_list

export const get_obj_entity = (objparam={filters:{}})=>{
  objselect.reset()

  objselect.table = `${table} r`
  objselect.foundrows = 1 //que devuelva el total de filas
  objselect.distinct = 1  //que aplique distinct
    
  query.fields.forEach(fieldconf => objselect.fields.push(fieldconf))
  
  if(isset(objparam.filters)){
    const arfilters = get_keys(objparam.filters)
    arfilters.map(field => `${field}='${objparam.filters[field]}'`).forEach(cond => objselect.where.push(cond))
  }
  
  if(!is_empty(query.joins)){
    query.joins.forEach(join => objselect.joins.push(join))
  }

  if(!is_empty(query.where)){
    query.where.forEach(cond => objselect.where.push(cond))
  } 
    
  return objselect
}

export const get_obj_insert = (objparam={fields:{}})=>{
  const objinsert = helpapify.insert
  objinsert.reset()
  objinsert.table = table

  if(!is_empty(objparam.fields)){
    const fields = get_keys(objparam.fields)
    fields.forEach( field => {
      objinsert.fields.push({k:field,v:objparam.fields[field]})
    })  
  }
  //pr(objinsert)
  return objinsert
}

export const get_obj_update = (objparam={fields:{},keys:[]},dbfields=[])=>{
  const objupdate = helpapify.update
  objupdate.reset()
  objupdate.table = table

  //evita que se actualicen todos los registros que no son una entidad
  if(objparam.keys.length==0) return null

  if(is_defined(objparam.fields)){
    const onlyfields = dbfields.map(dbfield => dbfield.field_name)
    const fields = get_keys(objparam.fields)

    fields.forEach( field => {
      if(!onlyfields.includes(field))
        return
  
      //si el campo es clave
      if(objparam.keys.includes(field)){
        objupdate.where.push(`${field}='${objparam.fields[field]}'`)
      }
      else
        objupdate.fields.push({k:field,v:objparam.fields[field]})
    })    
  }

  return objupdate
}

export const get_obj_detete = (objparam={fields:{},keys:[]})=>{
  const objdelete = helpapify.delete
  objdelete.reset()
  objdelete.table = table
  
  if(isset(objparam.fields) && isset(objparam.fields)){
    const fields = Object.keys(objparam.fields)
    fields.forEach( field => {
      if(!objparam.keys.includes(field))
        return
      objdelete.where.push(`${field}='${objparam.fields[field]}'`)
    })  
  }
  
  return objdelete
}



