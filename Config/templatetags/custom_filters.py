from django import template

register = template.Library()


@register.filter(name="typeOf")
def file_type(value):
    """Возвращает тип файла: 'image' или 'video'."""
    if "." in value:
        ext = value.rsplit(".", 1)[-1].lower()
        if ext in ["jpeg", "jpg", "png", "gif"]:
            return 'image'
        elif ext in ["mp4", "webm"]:
            return ext
    return "unknown"


@register.filter(name='get_class')
def get_class(value):
  return value.__class__.__name__