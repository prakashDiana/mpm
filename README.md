## Create Package

Begin where we left off by creating a new package as follows:

1. Start IntelliJ IDEA.
1. Open the mdtexfx project.
1. Expand **mdtexfx → src → main → java → com.mdtexfx** in the **Project** panel.
1. Right-click **com.mdtexfx**.
1. Click **New → Package**.
1. Set the value to `com.mdtexfx.processors`.
1. Press `Enter` to create the package.

Source: [Noto LGC Issue 32](https://github.com/notofonts/latin-greek-cyrillic/issues/32)

# A first-level heading
## A second-level heading
### A third-level heading

**This is bold text**

_This text is italicized_

~~This was mistaken text~~

**This text is _extremely_ important**

***All this text is important***

This is a <sub>subscript</sub> text

This is a <sup>superscript</sup> text

This is an <ins>underlined</ins> text

Text that is not a quote

> Text that is a quote

Use `git status` to list all new or modified files that haven&#x2019;t yet been committed.

Some basic Git commands are:
```
git status
git add
git commit
```

The background color is `#ffffff` for light mode and `#000000` for dark mode.

`#0969DA`

`rgb(9, 105, 218)`

`hsl(212, 92%, 45%)`

This site was built using [GitHub Pages](https://pages.github.com/).

# Example headings

## Sample Section

## This'll be a _Helpful_ Section About the Greek Letter Θ!
A heading containing characters not allowed in fragments, UTF-8 characters, two consecutive spaces between the first and second words, and formatting.

## This heading is not unique in the file

TEXT 1

## This heading is not unique in the file

TEXT 2

# Links to the example headings above

Link to the sample section: [Link Text](#sample-section).

Link to the helpful section: [Link Text](#thisll-be-a-helpful-section-about-the-greek-letter-Θ).

Link to the first non-unique section: [Link Text](#this-heading-is-not-unique-in-the-file).

Link to the second non-unique section: [Link Text](#this-heading-is-not-unique-in-the-file-1).

# Section Heading

Some body text of this section.

<a name="my-custom-anchor-point"></a>
Some text I want to provide a direct link to, but which doesn't have its own heading.

(… more content…)

[A link to that custom anchor](#my-custom-anchor-point)

![Screenshot of a comment on a GitHub issue showing an image, added in the Markdown, of an Octocat smiling and raising a tentacle.](https://myoctocat.com/assets/images/base-octocat.svg)

- George Washington
* John Adams
+ Thomas Jefferson

1. James Madison
2. James Monroe
3. John Quincy Adams

1. First list item
   - First nested list item
     - Second nested list item

100. First list item
     - First nested list item

100. First list item
     - First nested list item
       - Second nested list item

- [x] #739
- [ ] https://github.com/octo-org/octo-repo/issues/740
- [ ] Add delight to the experience when all tasks are complete :tada:

- [ ] \(Optional) Open a followup issue

@github/support What do you think about these updates?

@octocat :+1: This PR looks great - it's ready to merge! :shipit:

666 exports :money_mouth_face:

Here is a simple footnote[^1].

A footnote can also have multiple lines[^2].

[^1]: My reference.
[^2]: To add line breaks within a footnote, prefix new lines with 2 spaces.
  This is a second line.

> [!NOTE]
> Useful information that users should know, even when skimming content.

> [!TIP]
> Helpful advice for doing things better or more easily.

> [!IMPORTANT]
> Key information users need to know to achieve their goal.

> [!WARNING]
> Urgent info that needs immediate user attention to avoid problems.

> [!CAUTION]
> Advises about risks or negative outcomes of certain actions.

<!-- This content will not appear in the rendered Markdown -->

Let's rename \*our-new-project\* to \*our-old-project\*.\
OR\
Let's rename *our-new-project* to *our-old-project*.
