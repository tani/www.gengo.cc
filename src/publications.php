<!doctype html>
<html lang="en">
<?php
  $GLOBALS['title'] = "Masaya Taniguchi";
  include 'head.php';
?>
<body font="serif" p="sm:x-0 x-5" m="0" box-border>
  <?php include 'header.php'; ?>
  <main m="x-auto y-2" flex size="fit">
    <?php include 'sidebar.php'; ?>
    <article text="sm:justify" p="x-2" prose="~ stone">
      <h1>Publications and Talks</h1>
      <ol reversed>
        <?php
          $toml_decode = vrzno_env('toml_decode');
          $publications = $toml_decode(file_get_contents('static/publications.toml'))->publications;
          $publications = json_decode(strval(json_encode($publications)), true);
          usort($publications, function($a, $b) {
            if ($a['year'] === $b['year'] && (isset($a['month']) && isset($b['month']))) {
              return $a['month'] <=> $b['month'];
            }
            return $a['year'] <=> $b['year'];
          });
          $publications = array_reverse($publications);
        ?>
        <?php foreach ($publications as $pub) { ?>
        <li>
          <?= join(', ', $pub['authors']) ?>,
          <?= $pub['title'] ?>,
          <?= $pub['conference'] ?? $pub['event'] ?? $pub['journal'] ?>,
          <?php if (isset($pub['organization'])) { ?>
            <?= $pub['organization'] ?>,
          <?php } ?>
          <?= $pub['year'] ?>.<?= $pub['month'] ?>,
          <?php if (isset($pub['venue'])) { ?>
            <?= $pub['venue'] ?>
          <?php } ?>
          <span inline-block bg="gray-200" rounded="full" p="x-2 y-1" text="xs" font="bold" m="l-3">
            <?= $pub['type'] ?>
          </span>
          <?php if (isset($pub['refereed']) && $pub['refereed']) { ?>
            <span inline-block  bg="gray-200" rounded="full" p="x-2 y-1" text="xs" font="bold" m="l-3">
              refereed
            </span>
          <?php } ?>
          <?php if (isset($pub['abstract'])) { ?>
            <span>
              <label class="abst-btn" inline-block bg="stone-400" cursor="pointer" rounded="full" p="x-2 y-1" text="xs" font="bold" m="l-3">
                <input type="checkbox" hidden>
                abstract is available
              </label>
              <div bg="stone-100" rounded="md" p="x-2 y-1" m="t-2">
                <?= $pub['abstract'] ?>
              </div>
            </span>
          <?php } ?>
        </li>
        <?php } ?>
      </ol>
    </article>
  </main>
</body>
</html>

