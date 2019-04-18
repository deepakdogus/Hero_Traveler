import React from 'react'
import ReactDOM from 'react-dom'
import './App/Config/ReactotronConfig'
import './App/Shared/Web/index.css'
import './App/Shared/Web/animations.css'
import Root from './App/Containers/AppRoot'
import {register} from './App/Shared/Web/registerServiceWorker'
import { message } from 'antd'

message.config({
  top: 70,
})

require('dotenv').config()

ReactDOM.render(
  <Root />,
  document.getElementById('root'),
)

register()
