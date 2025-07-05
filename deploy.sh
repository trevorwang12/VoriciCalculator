#!/bin/bash

# Vorici Calculator 部署脚本
# 适用于云端服务器部署

set -e

echo "🚀 开始部署 Vorici Calculator..."

# 检查 Docker 是否安装
if ! command -v docker &> /dev/null; then
    echo "❌ Docker 未安装，请先安装 Docker"
    exit 1
fi

# 检查 Docker Compose 是否安装
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose 未安装，请先安装 Docker Compose"
    exit 1
fi

# 检查 Docker 服务是否运行
if ! docker info &> /dev/null; then
    echo "❌ Docker 服务未运行，请启动 Docker 服务"
    echo "运行: sudo systemctl start docker"
    exit 1
fi

# 停止现有容器（如果存在）
echo "🛑 停止现有容器..."
docker-compose -f docker-compose.prod.yml down 2>/dev/null || true

# 清理旧镜像（可选）
echo "🧹 清理旧镜像..."
docker image prune -f

# 构建并启动服务
echo "🏗️  构建并启动服务..."
docker-compose -f docker-compose.prod.yml up -d --build

# 等待服务启动
echo "⏳ 等待服务启动..."
sleep 10

# 检查服务状态
echo "📊 检查服务状态..."
docker-compose -f docker-compose.prod.yml ps

# 检查服务健康状态
echo "💊 检查服务健康状态..."
for i in {1..10}; do
    if curl -f http://localhost:8080 &> /dev/null; then
        echo "✅ 服务部署成功！"
        echo "🌐 访问地址: http://your-server-ip:8080"
        break
    else
        echo "⏳ 等待服务启动... ($i/10)"
        sleep 5
    fi
done

# 显示日志
echo "📝 最新日志:"
docker-compose -f docker-compose.prod.yml logs --tail=20

echo "🎉 部署完成！"
echo "📋 常用命令:"
echo "  查看状态: docker-compose -f docker-compose.prod.yml ps"
echo "  查看日志: docker-compose -f docker-compose.prod.yml logs -f"
echo "  停止服务: docker-compose -f docker-compose.prod.yml down"
echo "  重启服务: docker-compose -f docker-compose.prod.yml restart"