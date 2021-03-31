<!--
 * @Author: SoPudge
 * @Date: 2021-01-28 09:54:00
 * @LastEditors: SoPudge
 * @LastEditTime: 2021-01-29 10:51:58
 * @Description: file content
 * @FilePath: /ocs/ocs-server/docs/ErrorCode.md
-->

400 Family Client Error

4001001:
    BAD REQUESTS
    请求参数错误
    { error_code: 4001001, message: 'REQUEST PARAMS ERROR' }

4041001:
    RESOURCE NOT FOUND
    请求资源未找到
    { error_code: 40041001, message: 'RESROUCE NOT FOUND' }

4011 授权错误
4011001:
    UNAUTHORIZED ACCESS PASSWORD WRONG
    未授权，即密码错误
{ error_code: 4011001, message: 'UNAUTHORIZED ACCESS' }

4011002:
    UNAUTHORIZED ACCESS FOR THIS APPLICATION
     未授权，即权限不足
{ error_code: 4011001, message: 'UNAUTHORIZED ACCESS FOR THIS APPLICATION' }

4011003:
    UNAUTHORIZED ACCESS BECAUSE USER NOT FOUND
     系统查无此用户
{ error_code: 4011003, message: 'UNAUTHORIZED ACCESS BECAUSE USER NOT FOUND' }

500 Family Internal Error

5001:nodejs错误
5001001:
    INTERNAL ERROR
    nodejs报错
    { error_code: 5001001, message: 'INTERNAL ERROR'}

<!-- 5002:AXIOS错误
5002001:
    INTERNAL ERROR
    AXIOS请求错误
    { error_code: 5002001, message: 'INTERNAL ERROR'} -->


    
