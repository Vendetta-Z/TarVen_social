from django import template

register = template.Library()


@register.filter(name="typeOf")
def file_type(value):
    """Возвращает тип файла: 'image' или 'video'."""
    if "." in value:
        ext = value.rsplit(".", 1)[-1].lower()
        if ext in ["jpeg", "jpg", "png", "gif"]:
            return ext
        elif ext in ["mp4", "webm"]:
            return ext
    return "unknown"
