# frozen_string_literal: true

# Gives every HTML page of the site its own Open Graph preview card.
#
# At build time this generator writes a manifest (assets/img/og/cards.json)
# describing a card for every page, post and news item, and points each one's
# `og_image` at its card under assets/img/og/ unless the page sets its own
# image in front matter, which then takes precedence for the preview.
# After the build, bin/og-cards.mjs renders the manifest into PNGs with the
# template in bin/og-card.html.
require "json"

module SiteOgCards
  CARD_DIR = "assets/img/og"

  class Generator < Jekyll::Generator
    safe true
    priority :low

    def generate(site)
      entries = []
      documents = site.pages.select { |page| card_page?(page) } + site.posts.docs
      documents += site.collections["news"].docs if site.collections["news"]

      documents.each do |doc|
        slug = slug_for(doc.url)
        doc.data["og_image"] ||= "/#{CARD_DIR}/#{slug}.png"
        entries << entry_for(site, doc, slug)
      end

      manifest = Jekyll::PageWithoutAFile.new(site, site.source, CARD_DIR, "cards.json")
      manifest.content = JSON.pretty_generate(entries)
      manifest.data["layout"] = nil
      site.pages << manifest
    end

    private

    # Only real content pages get a card: skip feeds and data files, the 404
    # page, and the generated tag, category, year and pagination archives.
    def card_page?(page)
      return false unless page.html?
      return false if page.data["layout"].nil? || page.data["layout"] == "none"
      return false if page.url == "/404.html" || page.data["autogen"]
      return false if page.url.start_with?("/blog/tag/", "/blog/category/", "/blog/page/")
      return false if page.url.match?(%r{\A/blog/\d{4}/\z})

      true
    end

    def slug_for(url)
      slug = url.sub(%r{\A/}, "").sub(%r{/\z}, "").sub(/\.html\z/, "").downcase
      slug = slug.gsub(%r{[^a-z0-9]+}, "-").gsub(/\A-|-\z/, "")
      slug.empty? ? "index" : slug
    end

    def entry_for(site, doc, slug)
      home = doc.url == "/"
      collection = doc.respond_to?(:collection) ? doc.collection.label : nil
      post = collection == "posts"
      news = collection == "news"

      title =
        if home
          "#{site.config['first_name']} #{site.config['last_name']}"
        elsif news && doc.data["inline"]
          # Inline news items have no title of their own; Jekyll derives one
          # from the filename, so use the item text instead.
          plain_text(doc.content)
        else
          capitalize_first(doc.data["title"].to_s)
        end

      description = home ? site.config["description"] : doc.data["description"]
      section =
        if home then "about"
        elsif post then "blog"
        elsif news then "news"
        else doc.data["title"].to_s.downcase
        end
      date = post || news ? doc.date.strftime("%-d %b %Y") : nil

      {
        slug: slug,
        url: doc.url,
        home: home,
        title: plain_text(title),
        cjk: home ? site.config["cn_name"] : nil,
        description: plain_text(description),
        section: section,
        date: date,
      }
    end

    def capitalize_first(text)
      text.strip.sub(/\A[a-z]/, &:upcase)
    end

    # Markdown links become their text, HTML tags and emoji are dropped, and
    # whitespace is collapsed, so the card shows clean prose.
    def plain_text(text)
      text.to_s
          .gsub(/\[([^\]]+)\]\([^)]*\)/, '\1')
          .gsub(/<[^>]+>/, "")
          .gsub(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}]/, "")
          .gsub(/\s+/, " ")
          .strip
    end
  end
end
