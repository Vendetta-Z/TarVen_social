from marshmallow import Schema, fields

class PostsSchema(Schema):
    author = fields.Str()
    # author_id = fields.Str()
    description = fields.Str()
    image = fields.Str()
    created = fields.Str()