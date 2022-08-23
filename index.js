import { writeHTML } from './write.js'

const data = {
  projects: [
    {
      name: 'Project A <script>alert("123")<\/script>',
      url: '/123'
    },
    {
      name: 'Project B',
      url: '/456'
    },
    {
      name: 'Project C',
      url: '/789'
    }
  ],
  title: 'Hyperspaces'
}

const template = [
  "<!doctype html>",
  {
    "element": "html",
    "attribute": {
      "lang": "en"
    },
    "content": [
      {
        "element": "head",
        "content": [
          {
            "element": "title",
            "content": [
              "Example"
            ]
          }
        ]
      },
      {
        "element": "body",
        "content": [
          {
            "element": "h1",
            "content": [
              {
                "element": "em",
                "content": [
                  "hey,"
                ]
              },
              " 🌏."
            ]
          },
          {
            "element": "details",
            "attribute": {
              "class": "hs-accordion",
              "open": true
            },
            "content": [
              {
                "element": "summary",
                "content": [
                  {
                    "element": "strong",
                    "content": [
                      "Styles"
                    ]
                  }
                ]
              },
              "Style content"
            ]
          },
          {
            "element": "img",
            "attribute": {
              "alt": "Logo",
              "src": "./write_html/favicon-32x32.png",
              "title": "${title}"
            }
          },
          {
            "element": "h1"
          },
          {
            "element": "ul",
            "content": {
              "collection": {
                "data": "projects",
                "template": [
                  {
                    "element": "li",
                    "content": [
                      {
                        "element": "a",
                        "attribute": {
                          "href": "${url}"
                        },
                        "content": ["${name}"]
                      }
                    ]
                  }
                ]
              }
            }
          },
          {
            "operation": {
              "if": [
                { "==": [1, 2] },
                {
                  "element": "h1",
                  "content": ["Available"]
                },
                {
                  "element": "h2",
                  "attribute": {
                    "class": "red"
                  },
                  "content": ["Unavailable"]
                }
              ]
            }
          },

          {
            "operation": {
              "if": [
                { "<=": [1, 2] },
                {
                  "element": "p",
                  "content": ["Welcome!"]
                },
                {
                  "element": "p",
                  "content": ["Bye"]
                }
              ]
            }
          }
        ]
      }
    ]
  }
]

console.time()
const html = writeHTML(template, data, {
  // minified: true,
  // spaces: 4
})
console.timeEnd()

console.log(html)
