from marshmallow import Schema, fields

class CommentsSchema(Schema):
    author = fields.Str()
    post = fields.Str()
    text = fields.Str()
    created = fields.DateTime()