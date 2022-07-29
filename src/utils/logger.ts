import logger from 'pino'
import dayjs from 'dayjs'

enum logLevelInfo {
  info = 'info'
}

const log = logger({
  transport:{
    target: 'pino-pretty'
  }, 
  logLevel:logLevelInfo,
  base:{
    pid: false
  },
  timestamp:() => `,"time":"${dayjs().format()}"`
})

export default log