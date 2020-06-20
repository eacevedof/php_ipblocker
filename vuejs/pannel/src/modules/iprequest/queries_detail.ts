import helpapify from "@/helpers/apify"
import {is_defined, get_keys, isset, is_empty, is_key, pr} from "@/helpers/functions"

const objselect = helpapify.select

/**
 * 
 * 
SELECT DISTINCT r.insert_date
, SUBSTRING(r.`get`,1,25) g
, SUBSTRING(r.post,1,50) p
, r.domain
-- , r.request_uri
,SUBSTRING_INDEX(`request_uri`, '?', 1) requri

FROM app_ip_request r
LEFT JOIN app_ip_blacklist b
ON r.remote_ip = b.remote_ip
WHERE 1
AND r.remote_ip='184.154.76.20'
AND (r.`get`!='' OR r.post!='') 
ORDER BY r.insert_date DESC
LIMIT 250

SELECT DATE_FORMAT(insert_date,'%Y-%m-%d') d
, COUNT(id) i
FROM app_ip_request
WHERE 1
AND remote_ip='184.154.76.20'
GROUP BY DATE_FORMAT(insert_date,'%Y%m%d')
ORDER BY insert_date DESC
 * 
 */

const query_reqpostget = {
  table: "app_ip_request r",

  fields:[
    "r.insert_date",
    "SUBSTRING(r.`get`,1,25) g",
    "SUBSTRING(r.post,1,50) p",
    "r.domain",
    "SUBSTRING_INDEX(`request_uri`, '?', 1) requri",
  ],

  joins:[
    "LEFT JOIN app_ip_blacklist b ON r.remote_ip = b.remote_ip",
  ],

  where:[
    "AND (r.`get`!='' OR r.post!='')",
  ],
  
}


export const get_requests_by_ip = (remoteip)=>{

  const query = query_reqpostget
  objselect.reset()

  objselect.table = query.table
  objselect.foundrows = 1 //que devuelva el total de filas
  objselect.distinct = 1  //que aplique distinct
  
  query.fields.forEach(fieldconf => objselect.fields.push(fieldconf))
  
  const objparam= {
    filters:{
      op: "AND",
      fields:[
        {field:"r.remote_ip",value:remoteip}
      ]
    }
  }
  if(!is_empty(objparam.filters.fields)){
    const strcond = objparam.filters
                    .fields
                    .map(filter => `${filter.field} = '%${filter.value}%'`)
                    .join(` ${objparam.filters.op} `)

    objselect.where.push(`(${strcond})`)
  }

  if(!is_empty(query.joins)){
    query.joins.forEach(join => objselect.joins.push(join))
  }

  objselect.orderby.push("r.insert_date DESC")
  objselect.limit.perpage = 250

  return objselect

}//get_requests_by_ip


export const get_reqs_per_day = (remoteip)=>{

  const query = query_req_per_day
  objselect.reset()

  objselect.table = query.table
  objselect.foundrows = 1 //que devuelva el total de filas
  objselect.distinct = 1  //que aplique distinct
  
  query.fields.forEach(fieldconf => objselect.fields.push(fieldconf))
  
  const objparam= {
    filters:{
      op: "AND",
      fields:[
        {field:"r.remote_ip",value:remoteip}
      ]
    }
  }
  
  if(!is_empty(objparam.filters.fields)){
    const strcond = objparam.filters
                    .fields
                    .map(filter => `${filter.field} = '%${filter.value}%'`)
                    .join(` ${objparam.filters.op} `)

    objselect.where.push(`(${strcond})`)
  }

  if(!is_empty(query.joins)){
    query.joins.forEach(join => objselect.joins.push(join))
  }

  if(!is_empty(query.groupby)){
    query.groupby.forEach(groupby => objselect.groupby.push(groupby))
  }  

  return objselect

}//get_requests_by_ip