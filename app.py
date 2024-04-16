from website import create_app,run_migrations

app = create_app()


if __name__ == '__main__':
    #run_migrations("Add Comment Section into Booking Table")
    app.run(debug=True)


