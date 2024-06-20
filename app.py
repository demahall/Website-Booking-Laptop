from website import create_app,run_migrations
from waitress import serve

app = create_app()

myIP= '192.168.178.134'
if __name__ == '__main__':
    #run_migrations("Add Comment Section into Booking Table")
    #app.run(debug=True)
    serve(app, host=myIP, port=5000)


