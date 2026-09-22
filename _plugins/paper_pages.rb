# frozen_string_literal: true

require "bibtex"
require "cgi"
require "json"

# Enrich authored paper pages from the same bibliography used by the publication list.
module PaperPages
  BIB_FIELDS = %i[author title journal booktitle year volume number pages eid doi].freeze

  class Generator < Jekyll::Generator
    safe true
    priority :high

    def generate(site)
      bibliography = BibTeX.open(File.join(site.source, "_bibliography", "papers.bib"))
      pages = site.pages.select { |page| page.data["paper_key"] }
      registry = {}
      pages.each do |page|
        key = page.data.fetch("paper_key")
        entry = bibliography[key]
        raise "Missing bibliography entry for paper page: #{key}" unless entry
        raise "Duplicate paper page for bibliography entry: #{key}" if registry.key?(key)

        fields = %w[title abstract journal year volume number pages eid doi arxiv code keywords]
        paper = fields.to_h { |field| [field, entry[field.to_sym].to_s] }
        %w[title abstract year doi].each do |field|
          raise "Missing #{field} in bibliography entry: #{key}" if paper[field].empty?
        end
        paper["authors"] = entry.author.map { |author| [author.first, author.last].map(&:to_s).join(" ") }
        raise "Missing authors in bibliography entry: #{key}" if paper["authors"].empty?

        bib_fields = BIB_FIELDS.filter_map do |field|
          "  #{field} = {#{entry[field]}}" if entry[field]
        end
        paper["bibtex"] = "@#{entry.type}{#{key},\n#{bib_fields.join(",\n")}\n}"
        page.data["title"] = paper["title"]
        page.data["paper"] = paper
        registry[key] = { "url" => page.url, "title" => paper["title"], "abstract" => paper["abstract"] }
      end
      site.data["paper_pages"] = registry
    end
  end

  def self.metadata(page)
    paper = page.data.fetch("paper")
    origin = page.site.config.fetch("url").sub(%r{/$}, "") + page.site.config.fetch("baseurl", "").to_s
    url = origin + page.url
    fields = [["citation_title", paper["title"]]]
    fields += paper["authors"].map { |author| ["citation_author", author] }
    fields += [
      ["citation_publication_date", paper["year"]],
      ["citation_journal_title", paper["journal"]],
      ["citation_volume", paper["volume"].split(",").first],
      ["citation_issue", paper["number"]],
      ["citation_doi", paper["doi"]]
    ]
    tags = fields.filter_map do |name, value|
      next if value.nil? || value.empty?
      %(<meta name="#{name}" content="#{CGI.escapeHTML(value)}">)
    end
    # External preprints are resource links, not same-directory citation_pdf_url values.
    authors = paper["authors"].map do |name|
      person = { "@type" => "Person", "name" => name }
      person["@id"] = "#{origin}/#person" if name == "#{page.site.config['first_name']} #{page.site.config['last_name']}"
      person
    end
    article = {
      "@context" => "https://schema.org", "@type" => "ScholarlyArticle",
      "@id" => "#{url}#article", "url" => url, "headline" => paper["title"],
      "author" => authors, "datePublished" => paper["year"], "abstract" => paper["abstract"],
      "identifier" => "https://doi.org/#{paper['doi']}", "sameAs" => "https://doi.org/#{paper['doi']}",
      "isPartOf" => { "@type" => "Periodical", "name" => paper["journal"] },
      "keywords" => paper["keywords"].split(",").map(&:strip)
    }
    json = JSON.generate(article).gsub("<", '\u003c').gsub(">", '\u003e').gsub("&", '\u0026')
    tags << %(<script type="application/ld+json">#{json}</script>)
    tags.join("\n")
  end
end

# Insert into the rendered head without copying the gem-owned head template.
Jekyll::Hooks.register :pages, :post_render do |page|
  next unless page.data["paper"]
  raise "Paper page has no HTML head: #{page.path}" unless page.output.include?("</head>")

  page.output = page.output.sub("</head>") { "#{PaperPages.metadata(page)}\n</head>" }
end
