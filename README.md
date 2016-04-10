# DeployAgent
Deploy Agent  是一个借鉴于 [aws code-deploy-agent](http://docs.aws.amazon.com/codedeploy/latest/userguide/how-to-run-agent.html) 的工具，在中国 AWS 并没有 CodeDeploy 服务，所以我设计了这个工具来替代这部分的作用，附带的也使 Aliyun, QCloud, uCloud 都具备了代码部署的功能

# 为什么需要 Agent
ssh, ansible 等相应的运维工具也能解决部分部署问题，但是存在一定的 Private key 泄露，及团队多人成员使用不便等问题，并且不支持多服务的部署等， Agent 更好的解决了这个问题

1. 不需要打开外部端口，安全
2. 更加多样部署方式，支持 ACL 等
3. s3 等 文件系统的集成等，也可以与 github.com 集成使用。

DeployAgent 做为一个自动部署的工具，当代码 push 到 github 时，触发部署而不需要人为的干预，从而减少我们的工作量，也是 [Continuous delivery](https://en.wikipedia.org/wiki/Continuous_delivery) 重要的一环

# 概念

## 源 source
DeployAgent 支持多种类型的资源，lcoal (s3, ftp , http, git 暂未实现) 等。

## 资源类型 preprocesses
支持 zip, tar.gz, tar.bz2 打包的文件。

## 触发器 Trigger
我们 push 代码时，github 可以通过 webhooks 等方式触发 DeployAgent 启动一个任务进行部署，我们设计了多种模式来支持触发，包括
SQS 消息列队，HTTP 触发等，在 消息列队中我们可以使用, 更安全的检查(如 ACL）来控制任务的触发。

## 任务 Task
部置任务的单元就是 Task , Task 的基本工作，从 Source 中提供的资源下载代码到服务器的工作目录，然后执行 部署 script. 并把这个过程的 失败或成功等状态，通过消息列队返回。

## 任务列队 Queue
我们建立了任务列队，无论任何时刻当有新的任务进来时，Task 的会等待之前的任务结束后再执行，任务会一个一个接着顺序的执行，这样避免对于目标机器资源的抢占。另可以通过更改 config.tasks.concurrency 来控制并发任务的数量，默认是 1

## 部署 script deploy.yml
部署脚步

## 测试
测试 code-deploy-agent 是不是正常工作
### http 方式

```bash
curl -d '{"name":"test", "source": "examples/deploy.zip"}' -H "Content-Type: application/json" http://127.0.0.1:8040/trigger
```

### SQS 
首先，启动 deploy-agent 服务器，启用 --verbose-sqs-url 参数，返回 SQS 地址信息。需要设置好 SQS 配置
```
npm run dev --verbose-sqs-url
```
 QueueUrl: 'https://sqs.cn-north-1.amazonaws.com.cn/560397965647/test-deploy-agent' }


## 配置

### SQS 配置
在 home 目录下，设置 .deploy-agent 的内容为
```yaml
---
sqs:
  accessKeyId: [accessKeyId]
  secretAccessKey: [secretAccessKey]
  region: cn-north-1
  endpoint: https://sqs.cn-north-1.amazonaws.com.cn/12341234asd/deploy
```

# RoadMap

- [ ] Config
	- [x] 基础的 etc, home , default 配置功能完成
- [ ] Logger
- [x] 支持多种触发器
	- [x] http
	- [ ] sqs
	- [ ] aliyun
- [ ] Runner
	- [ ] Task State Machine
	- [ ] parse deploy.yml
	- [ ] plugins
