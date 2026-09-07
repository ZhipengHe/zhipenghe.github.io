---
layout: page
permalink: /slides/
title: slides
description: Slides and posters from my talks, hosted at slides.zhipenghe.me
nav: true
nav_order: 7
---

{% assign base = site.data.slides.base_url %}
{% assign groups = site.data.slides.items | group_by: "year" %}

<div class="publications">
{% for group in groups %}
  <h2 class="bibliography">{{ group.name }}</h2>
  <ol class="bibliography">
  {% for item in group.items %}
    <li>
      <div class="row">
        <div class="col col-sm-2 abbr">
          <abbr class="badge rounded w-100">{{ item.type }}</abbr>
        </div>
        <div class="col-sm-8">
          <div class="title">{{ item.title }}</div>
          <div class="periodical">{{ item.date }}{% if item.venue != "" %} &bull; {{ item.venue }}{% endif %}</div>
          <div class="periodical">{{ item.description }}</div>
          <div class="links">
            {% if item.slides %}<a href="{{ base }}{{ item.slides }}" class="btn btn-sm z-depth-0" role="button">Slides</a>{% endif %}
            {% if item.pdf %}<a href="{{ base }}{{ item.pdf }}" class="btn btn-sm z-depth-0" role="button">PDF</a>{% endif %}
            {% if item.notes %}<a href="{{ base }}{{ item.notes }}" class="btn btn-sm z-depth-0" role="button">Speaker Notes</a>{% endif %}
          </div>
        </div>
      </div>
    </li>
  {% endfor %}
  </ol>
{% endfor %}
</div>
