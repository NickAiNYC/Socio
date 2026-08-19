# Socio Skills

Vertical expertise encoded as `SKILL.md` files that **auto-activate** from
merchant context (vertical + dormant-customer count) and compound across
merchants: what worked for Cristal Flowers is applied to El Nuevo Café.

## Layout

```
skills/
├── florist-recovery/SKILL.md      # vertical: florist, min 100 dormant
├── cafe-loyalty/SKILL.md          # vertical: cafe, min 50 dormant
└── clinic-dormant-leads/SKILL.md  # vertical: clinic, min 25 dormant
```

## Anatomy of a skill

Each `SKILL.md` starts with frontmatter (name, description, `vertical`,
`min_dormant_count`, `whenToUse`) followed by the body: segmentation, offer
selection, channel selection, attribution window, and rules. Rules are
enforced — discounts below a floor, opt-outs, message caps, and Governor
approval before send are non-negotiable.

## Auto-activation

`selectSkills({ vertical, dormantCount })` (`engines/growth-os/skills.mjs`)
returns the applicable skills and why. Agents request activation through the
governed MCP tool `growth_os_select_skills` (read-only); the returned skill
body is what the agent follows for that merchant.

## Adding a skill

1. Create `skills/<kebab-name>/SKILL.md` with frontmatter + body.
2. Frontmatter keys: `name`, `description`, `vertical` (or omit for
   vertical-agnostic), `min_dormant_count` (or omit), `whenToUse`.
3. Run the tests (`npm test` — skills tests load the pack and assert the
   frontmatter parses and activation rules hold).

## Installing into Hermes

Hermes executes skills from its own profile skill directories. To make a
Socio skill available to a locked profile:

```bash
cp -r skills/<name> ~/.hermes/profiles/<profile>/skills/<name>
```

(Do this on the pilot host, not via the repo — profile state is host-local.
Locked profiles keep zero MCP servers; skills are instruction packs, not code
execution paths.)
