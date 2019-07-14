require "parallel"

task :default do
  names = FileList["src/*/"].sub("src/", "").sub(/\/$/, "").reject do |name|
    name == "_"
  end
  Parallel.each names do |name|
    system "rm", "-rf", "dist/#{name}"
    system "yarn", "node-sass", "--output", "dist/#{name}", "src/#{name}/index.scss"
    system "yarn", "postcss", "dist/#{name}/index.css", "-o", "dist/#{name}/index.min.css"
  end
end
