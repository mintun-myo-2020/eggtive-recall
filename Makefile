start_all_dev: start_server_dev start_client_dev start_serverless_dev

start_server_dev:
		cd server && (CompileDaemon -command=./eggtive-recall > server.log 2>&1 &)

start_client_dev:
		cd client && (npm run dev > client.log 2>&1 &)

start_serverless_dev:
		cd serverless && (sls offline > serverless.log 2>&1 &)