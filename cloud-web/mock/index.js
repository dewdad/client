import Mock from 'mockjs'
import navlist from './navlist'
import register from './register'

let data = [].concat(navlist, register)

data.forEach(function(res){
    Mock.mock(res.path, res.data)
})

export default Mock