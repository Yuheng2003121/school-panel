# 使用 Node.js 官方镜像作为基础
FROM node:18

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 package-lock.json 文件
COPY package*.json ./

# 安装依赖
RUN npm install

# 复制其余的应用代码
COPY . .

# 添加数据库迁移
RUN npx prisma migrate dev --name init

# 生成 Prisma 数据库客户端
RUN npx prisma generate

# 构建 Next.js 应用
RUN npm run build

# 暴露应用运行的端口
EXPOSE 3000

# 启动 Next.js 应用
CMD ["npm", "run", "start"]