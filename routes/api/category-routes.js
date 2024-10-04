const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

router.get('/', async (req, res) => {
  // find all categories'
   // be sure to include its associated Products
  try {
    const categories = await Category.findAll({
      include: [{ model: Product }]
    })
   
    const category = categories.map((post) => post.get({ plain: true }));

    res.json(category);//Sending back a response in the form of a json object. 

  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }


});

router.get('/:id', async (req, res) => {
  // find one category by its `id` value
  try {
    const categories = await Category.findByPk(
      req.params.id, {
      include: [{ model: Product }]
    })
    // be sure to include its associated Products
    const category = categories.get({ plain: true }); //We only have one value, so map won't work.
    res.json(category);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.post('/', async(req, res) => {
  // create a new category
  try {
    const categories = await Category.create(
      req.body,
    )
    // be sure to include its associated Products
    const category = categories.get({ plain: true }); //We only have one value, so map won't work.
    res.json(category);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.put('/:id', (req, res) => {
  // update a category by its `id` value
  Category.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
  .then((category) => {
    if (req.body.tagIds && req.body.tagIds.length) {
      
      ProductTag.findAll({
        where: { product_id: req.params.id }
      }).then((productTags) => {
        // create filtered list of new tag_ids
        const productTagIds = productTags.map(({ tag_id }) => tag_id);
        const newProductTags = req.body.tagIds
        .filter((tag_id) => !productTagIds.includes(tag_id))
        .map((tag_id) => {
          return {
            product_id: req.params.id,
            tag_id,
          };
        });

          // figure out which ones to remove
        const productTagsToRemove = productTags
        .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
        .map(({ id }) => id);
                // run both actions
        return Promise.all([
          ProductTag.destroy({ where: { id: productTagsToRemove } }),
          ProductTag.bulkCreate(newProductTags),
        ]);
      });
    }

    return res.json(product);
  })
  .catch((err) => {
    // console.log(err);
    res.status(400).json(err);
  });
});

router.delete('/:id', async (req, res) => {
  // delete a category by its `id` value
  try {
    const categoryData = await Category.destroy({
      where: {
        id: req.params.id
      }
    });

    if (!categoryData) {
      res.status(404).json({ message: 'No Category found with this id!' });
      return;
    }

    res.status(200).json(categoryData);
  } catch (err) {
    res.status(500).json(err);
  }
});
module.exports = router;
