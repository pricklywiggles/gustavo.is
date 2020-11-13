import React from "react";
import { Box } from "../components/layouts";
import { useCounter } from "../utils/hooks";
import { Header } from "../components/header";
import styled from "@emotion/styled";
import { css } from "@emotion/core";

export default function Test() {
  const [counter, reset] = useCounter(1, 500);

  React.useEffect(() => {
    document.body.dataset.theme = "dark";
  }, []);

  return (
    <main>
      <Header />
      <div>
        If no percentages are declared, both the images will be 50% opaque, with
        a cross-fade rendering as an even merge of both images. The 50%/50%
        example seen above did not need to have the percentages listed, as when
        a percentage value is omitted, the included percentages are added
        together and subtracted from 100%. The result, if greater than 0, is
        then divided equally between all images with omitted percentages. In the
        last example, the sum of both percentages is not 100%, and therefore
        both images include their respective opacities. If no percentages are
        declared and three images are included, each image will be 33.33%
        opaque. The two following are lines (almost) identical: If no
        percentages are declared, both the images will be 50% opaque, with a
        cross-fade rendering as an even merge of both images. The 50%/50%
        example seen above did not need to have the percentages listed, as when
        a percentage value is omitted, the included percentages are added
        together and subtracted from 100%. The result, if greater than 0, is
        then divided equally between all images with omitted percentages. In the
        last example, the sum of both percentages is not 100%, and therefore
        both images include their respective opacities. If no percentages are
        declared and three images are included, each image will be 33.33%
        opaque. The two following are lines (almost) identical: If no
        percentages are declared, both the images will be 50% opaque, with a
        cross-fade rendering as an even merge of both images. The 50%/50%
        example seen above did not need to have the percentages listed, as when
        a percentage value is omitted, the included percentages are added
        together and subtracted from 100%. The result, if greater than 0, is
        then divided equally between all images with omitted percentages. In the
        last example, the sum of both percentages is not 100%, and therefore
        both images include their respective opacities. If no percentages are
        declared and three images are included, each image will be 33.33%
        opaque. The two following are lines (almost) identical: If no
        percentages are declared, both the images will be 50% opaque, with a
        cross-fade rendering as an even merge of both images. The 50%/50%
        example seen above did not need to have the percentages listed, as when
        a percentage value is omitted, the included percentages are added
        together and subtracted from 100%. The result, if greater than 0, is
        then divided equally between all images with omitted percentages. In the
        last example, the sum of both percentages is not 100%, and therefore
        both images include their respective opacities. If no percentages are
        declared and three images are included, each image will be 33.33%
        opaque. The two following are lines (almost) identical:
      </div>
      <div css={{ position: "relative" }}>
        <Module>
          <ModuleInside className="module-inside">{counter}</ModuleInside>
        </Module>
      </div>
      <div>
        If no percentages are declared, both the images will be 50% opaque, with
        a cross-fade rendering as an even merge of both images. The 50%/50%
        example seen above did not need to have the percentages listed, as when
        a percentage value is omitted, the included percentages are added
        together and subtracted from 100%. The result, if greater than 0, is
        then divided equally between all images with omitted percentages. In the
        last example, the sum of both percentages is not 100%, and therefore
        both images include their respective opacities. If no percentages are
        declared and three images are included, each image will be 33.33%
        opaque. The two following are lines (almost) identical: If no
        percentages are declared, both the images will be 50% opaque, with a
        cross-fade rendering as an even merge of both images. The 50%/50%
        example seen above did not need to have the percentages listed, as when
        a percentage value is omitted, the included percentages are added
        together and subtracted from 100%. The result, if greater than 0, is
        then divided equally between all images with omitted percentages. In the
        last example, the sum of both percentages is not 100%, and therefore
        both images include their respective opacities. If no percentages are
        declared and three images are included, each image will be 33.33%
        opaque. The two following are lines (almost) identical: If no
        percentages are declared, both the images will be 50% opaque, with a
        cross-fade rendering as an even merge of both images. The 50%/50%
        example seen above did not need to have the percentages listed, as when
        a percentage value is omitted, the included percentages are added
        together and subtracted from 100%. The result, if greater than 0, is
        then divided equally between all images with omitted percentages. In the
        last example, the sum of both percentages is not 100%, and therefore
        both images include their respective opacities. If no percentages are
        declared and three images are included, each image will be 33.33%
        opaque. The two following are lines (almost) identical: If no
        percentages are declared, both the images will be 50% opaque, with a
        cross-fade rendering as an even merge of both images. The 50%/50%
        example seen above did not need to have the percentages listed, as when
        a percentage value is omitted, the included percentages are added
        together and subtracted from 100%. The result, if greater than 0, is
        then divided equally between all images with omitted percentages. In the
        last example, the sum of both percentages is not 100%, and therefore
        both images include their respective opacities. If no percentages are
        declared and three images are included, each image will be 33.33%
        opaque. The two following are lines (almost) identical: If no
        percentages are declared, both the images will be 50% opaque, with a
        cross-fade rendering as an even merge of both images. The 50%/50%
        example seen above did not need to have the percentages listed, as when
        a percentage value is omitted, the included percentages are added
        together and subtracted from 100%. The result, if greater than 0, is
        then divided equally between all images with omitted percentages. In the
        last example, the sum of both percentages is not 100%, and therefore
        both images include their respective opacities. If no percentages are
        declared and three images are included, each image will be 33.33%
        opaque. The two following are lines (almost) identical: If no
        percentages are declared, both the images will be 50% opaque, with a
        cross-fade rendering as an even merge of both images. The 50%/50%
        example seen above did not need to have the percentages listed, as when
        a percentage value is omitted, the included percentages are added
        together and subtracted from 100%. The result, if greater than 0, is
        then divided equally between all images with omitted percentages. In the
        last example, the sum of both percentages is not 100%, and therefore
        both images include their respective opacities. If no percentages are
        declared and three images are included, each image will be 33.33%
        opaque. The two following are lines (almost) identical: If no
        percentages are declared, both the images will be 50% opaque, with a
        cross-fade rendering as an even merge of both images. The 50%/50%
        example seen above did not need to have the percentages listed, as when
        a percentage value is omitted, the included percentages are added
        together and subtracted from 100%. The result, if greater than 0, is
        then divided equally between all images with omitted percentages. In the
        last example, the sum of both percentages is not 100%, and therefore
        both images include their respective opacities. If no percentages are
        declared and three images are included, each image will be 33.33%
        opaque. The two following are lines (almost) identical: If no
        percentages are declared, both the images will be 50% opaque, with a
        cross-fade rendering as an even merge of both images. The 50%/50%
        example seen above did not need to have the percentages listed, as when
        a percentage value is omitted, the included percentages are added
        together and subtracted from 100%. The result, if greater than 0, is
        then divided equally between all images with omitted percentages. In the
        last example, the sum of both percentages is not 100%, and therefore
        both images include their respective opacities. If no percentages are
        declared and three images are included, each image will be 33.33%
        opaque. The two following are lines (almost) identical: If no
        percentages are declared, both the images will be 50% opaque, with a
        cross-fade rendering as an even merge of both images. The 50%/50%
        example seen above did not need to have the percentages listed, as when
        a percentage value is omitted, the included percentages are added
        together and subtracted from 100%. The result, if greater than 0, is
        then divided equally between all images with omitted percentages. In the
        last example, the sum of both percentages is not 100%, and therefore
        both images include their respective opacities. If no percentages are
        declared and three images are included, each image will be 33.33%
        opaque. The two following are lines (almost) identical: If no
        percentages are declared, both the images will be 50% opaque, with a
        cross-fade rendering as an even merge of both images. The 50%/50%
        example seen above did not need to have the percentages listed, as when
        a percentage value is omitted, the included percentages are added
        together and subtracted from 100%. The result, if greater than 0, is
        then divided equally between all images with omitted percentages. In the
        last example, the sum of both percentages is not 100%, and therefore
        both images include their respective opacities. If no percentages are
        declared and three images are included, each image will be 33.33%
        opaque. The two following are lines (almost) identical: If no
        percentages are declared, both the images will be 50% opaque, with a
        cross-fade rendering as an even merge of both images. The 50%/50%
        example seen above did not need to have the percentages listed, as when
        a percentage value is omitted, the included percentages are added
        together and subtracted from 100%. The result, if greater than 0, is
        then divided equally between all images with omitted percentages. In the
        last example, the sum of both percentages is not 100%, and therefore
        both images include their respective opacities. If no percentages are
        declared and three images are included, each image will be 33.33%
        opaque. The two following are lines (almost) identical: If no
        percentages are declared, both the images will be 50% opaque, with a
        cross-fade rendering as an even merge of both images. The 50%/50%
        example seen above did not need to have the percentages listed, as when
        a percentage value is omitted, the included percentages are added
        together and subtracted from 100%. The result, if greater than 0, is
        then divided equally between all images with omitted percentages. In the
        last example, the sum of both percentages is not 100%, and therefore
        both images include their respective opacities. If no percentages are
        declared and three images are included, each image will be 33.33%
        opaque. The two following are lines (almost) identical: If no
        percentages are declared, both the images will be 50% opaque, with a
        cross-fade rendering as an even merge of both images. The 50%/50%
        example seen above did not need to have the percentages listed, as when
        a percentage value is omitted, the included percentages are added
        together and subtracted from 100%. The result, if greater than 0, is
        then divided equally between all images with omitted percentages. In the
        last example, the sum of both percentages is not 100%, and therefore
        both images include their respective opacities. If no percentages are
        declared and three images are included, each image will be 33.33%
        opaque. The two following are lines (almost) identical:If no percentages
        are declared, both the images will be 50% opaque, with a cross-fade
        rendering as an even merge of both images. The 50%/50% example seen
        above did not need to have the percentages listed, as when a percentage
        value is omitted, the included percentages are added together and
        subtracted from 100%. The result, if greater than 0, is then divided
        equally between all images with omitted percentages. In the last
        example, the sum of both percentages is not 100%, and therefore both
        images include their respective opacities. If no percentages are
        declared and three images are included, each image will be 33.33%
        opaque. The two following are lines (almost) identical: If no
        percentages are declared, both the images will be 50% opaque, with a
        cross-fade rendering as an even merge of both images. The 50%/50%
        example seen above did not need to have the percentages listed, as when
        a percentage value is omitted, the included percentages are added
        together and subtracted from 100%. The result, if greater than 0, is
        then divided equally between all images with omitted percentages. In the
        last example, the sum of both percentages is not 100%, and therefore
        both images include their respective opacities. If no percentages are
        declared and three images are included, each image will be 33.33%
        opaque. The two following are lines (almost) identical: If no
        percentages are declared, both the images will be 50% opaque, with a
        cross-fade rendering as an even merge of both images. The 50%/50%
        example seen above did not need to have the percentages listed, as when
        a percentage value is omitted, the included percentages are added
        together and subtracted from 100%. The result, if greater than 0, is
        then divided equally between all images with omitted percentages. In the
        last example, the sum of both percentages is not 100%, and therefore
        both images include their respective opacities. If no percentages are
        declared and three images are included, each image will be 33.33%
        opaque. The two following are lines (almost) identical: If no
        percentages are declared, both the images will be 50% opaque, with a
        cross-fade rendering as an even merge of both images. The 50%/50%
        example seen above did not need to have the percentages listed, as when
        a percentage value is omitted, the included percentages are added
        together and subtracted from 100%. The result, if greater than 0, is
        then divided equally between all images with omitted percentages. In the
        last example, the sum of both percentages is not 100%, and therefore
        both images include their respective opacities. If no percentages are
        declared and three images are included, each image will be 33.33%
        opaque. The two following are lines (almost) identical: If no
        percentages are declared, both the images will be 50% opaque, with a
        cross-fade rendering as an even merge of both images. The 50%/50%
        example seen above did not need to have the percentages listed, as when
        a percentage value is omitted, the included percentages are added
        together and subtracted from 100%. The result, if greater than 0, is
        then divided equally between all images with omitted percentages. In the
        last example, the sum of both percentages is not 100%, and therefore
        both images include their respective opacities. If no percentages are
        declared and three images are included, each image will be 33.33%
        opaque. The two following are lines (almost) identical: If no
        percentages are declared, both the images will be 50% opaque, with a
        cross-fade rendering as an even merge of both images. The 50%/50%
        example seen above did not need to have the percentages listed, as when
        a percentage value is omitted, the included percentages are added
        together and subtracted from 100%. The result, if greater than 0, is
        then divided equally between all images with omitted percentages. In the
        last example, the sum of both percentages is not 100%, and therefore
        both images include their respective opacities. If no percentages are
        declared and three images are included, each image will be 33.33%
        opaque. The two following are lines (almost) identical: If no
        percentages are declared, both the images will be 50% opaque, with a
        cross-fade rendering as an even merge of both images. The 50%/50%
        example seen above did not need to have the percentages listed, as when
        a percentage value is omitted, the included percentages are added
        together and subtracted from 100%. The result, if greater than 0, is
        then divided equally between all images with omitted percentages. In the
        last example, the sum of both percentages is not 100%, and therefore
        both images include their respective opacities. If no percentages are
        declared and three images are included, each image will be 33.33%
        opaque. The two following are lines (almost) identical: If no
        percentages are declared, both the images will be 50% opaque, with a
        cross-fade rendering as an even merge of both images. The 50%/50%
        example seen above did not need to have the percentages listed, as when
        a percentage value is omitted, the included percentages are added
        together and subtracted from 100%. The result, if greater than 0, is
        then divided equally between all images with omitted percentages. In the
        last example, the sum of both percentages is not 100%, and therefore
        both images include their respective opacities. If no percentages are
        declared and three images are included, each image will be 33.33%
        opaque. The two following are lines (almost) identical: If no
        percentages are declared, both the images will be 50% opaque, with a
        cross-fade rendering as an even merge of both images. The 50%/50%
        example seen above did not need to have the percentages listed, as when
        a percentage value is omitted, the included percentages are added
        together and subtracted from 100%. The result, if greater than 0, is
        then divided equally between all images with omitted percentages. In the
        last example, the sum of both percentages is not 100%, and therefore
        both images include their respective opacities. If no percentages are
        declared and three images are included, each image will be 33.33%
        opaque. The two following are lines (almost) identical: If no
        percentages are declared, both the images will be 50% opaque, with a
        cross-fade rendering as an even merge of both images. The 50%/50%
        example seen above did not need to have the percentages listed, as when
        a percentage value is omitted, the included percentages are added
        together and subtracted from 100%. The result, if greater than 0, is
        then divided equally between all images with omitted percentages. In the
        last example, the sum of both percentages is not 100%, and therefore
        both images include their respective opacities. If no percentages are
        declared and three images are included, each image will be 33.33%
        opaque. The two following are lines (almost) identical: If no
        percentages are declared, both the images will be 50% opaque, with a
        cross-fade rendering as an even merge of both images. The 50%/50%
        example seen above did not need to have the percentages listed, as when
        a percentage value is omitted, the included percentages are added
        together and subtracted from 100%. The result, if greater than 0, is
        then divided equally between all images with omitted percentages. In the
        last example, the sum of both percentages is not 100%, and therefore
        both images include their respective opacities. If no percentages are
        declared and three images are included, each image will be 33.33%
        opaque. The two following are lines (almost) identical: If no
        percentages are declared, both the images will be 50% opaque, with a
        cross-fade rendering as an even merge of both images. The 50%/50%
        example seen above did not need to have the percentages listed, as when
        a percentage value is omitted, the included percentages are added
        together and subtracted from 100%. The result, if greater than 0, is
        then divided equally between all images with omitted percentages. In the
        last example, the sum of both percentages is not 100%, and therefore
        both images include their respective opacities. If no percentages are
        declared and three images are included, each image will be 33.33%
        opaque. The two following are lines (almost) identical: If no
        percentages are declared, both the images will be 50% opaque, with a
        cross-fade rendering as an even merge of both images. The 50%/50%
        example seen above did not need to have the percentages listed, as when
        a percentage value is omitted, the included percentages are added
        together and subtracted from 100%. The result, if greater than 0, is
        then divided equally between all images with omitted percentages. In the
        last example, the sum of both percentages is not 100%, and therefore
        both images include their respective opacities. If no percentages are
        declared and three images are included, each image will be 33.33%
        opaque. The two following are lines (almost) identical:If no percentages
        are declared, both the images will be 50% opaque, with a cross-fade
        rendering as an even merge of both images. The 50%/50% example seen
        above did not need to have the percentages listed, as when a percentage
        value is omitted, the included percentages are added together and
        subtracted from 100%. The result, if greater than 0, is then divided
        equally between all images with omitted percentages. In the last
        example, the sum of both percentages is not 100%, and therefore both
        images include their respective opacities. If no percentages are
        declared and three images are included, each image will be 33.33%
        opaque. The two following are lines (almost) identical: If no
        percentages are declared, both the images will be 50% opaque, with a
        cross-fade rendering as an even merge of both images. The 50%/50%
        example seen above did not need to have the percentages listed, as when
        a percentage value is omitted, the included percentages are added
        together and subtracted from 100%. The result, if greater than 0, is
        then divided equally between all images with omitted percentages. In the
        last example, the sum of both percentages is not 100%, and therefore
        both images include their respective opacities. If no percentages are
        declared and three images are included, each image will be 33.33%
        opaque. The two following are lines (almost) identical: If no
        percentages are declared, both the images will be 50% opaque, with a
        cross-fade rendering as an even merge of both images. The 50%/50%
        example seen above did not need to have the percentages listed, as when
        a percentage value is omitted, the included percentages are added
        together and subtracted from 100%. The result, if greater than 0, is
        then divided equally between all images with omitted percentages. In the
        last example, the sum of both percentages is not 100%, and therefore
        both images include their respective opacities. If no percentages are
        declared and three images are included, each image will be 33.33%
        opaque. The two following are lines (almost) identical: If no
        percentages are declared, both the images will be 50% opaque, with a
        cross-fade rendering as an even merge of both images. The 50%/50%
        example seen above did not need to have the percentages listed, as when
        a percentage value is omitted, the included percentages are added
        together and subtracted from 100%. The result, if greater than 0, is
        then divided equally between all images with omitted percentages. In the
        last example, the sum of both percentages is not 100%, and therefore
        both images include their respective opacities. If no percentages are
        declared and three images are included, each image will be 33.33%
        opaque. The two following are lines (almost) identical: If no
        percentages are declared, both the images will be 50% opaque, with a
        cross-fade rendering as an even merge of both images. The 50%/50%
        example seen above did not need to have the percentages listed, as when
        a percentage value is omitted, the included percentages are added
        together and subtracted from 100%. The result, if greater than 0, is
        then divided equally between all images with omitted percentages. In the
        last example, the sum of both percentages is not 100%, and therefore
        both images include their respective opacities. If no percentages are
        declared and three images are included, each image will be 33.33%
        opaque. The two following are lines (almost) identical: If no
        percentages are declared, both the images will be 50% opaque, with a
        cross-fade rendering as an even merge of both images. The 50%/50%
        example seen above did not need to have the percentages listed, as when
        a percentage value is omitted, the included percentages are added
        together and subtracted from 100%. The result, if greater than 0, is
        then divided equally between all images with omitted percentages. In the
        last example, the sum of both percentages is not 100%, and therefore
        both images include their respective opacities. If no percentages are
        declared and three images are included, each image will be 33.33%
        opaque. The two following are lines (almost) identical: If no
        percentages are declared, both the images will be 50% opaque, with a
        cross-fade rendering as an even merge of both images. The 50%/50%
        example seen above did not need to have the percentages listed, as when
        a percentage value is omitted, the included percentages are added
        together and subtracted from 100%. The result, if greater than 0, is
        then divided equally between all images with omitted percentages. In the
        last example, the sum of both percentages is not 100%, and therefore
        both images include their respective opacities. If no percentages are
        declared and three images are included, each image will be 33.33%
        opaque. The two following are lines (almost) identical: If no
        percentages are declared, both the images will be 50% opaque, with a
        cross-fade rendering as an even merge of both images. The 50%/50%
        example seen above did not need to have the percentages listed, as when
        a percentage value is omitted, the included percentages are added
        together and subtracted from 100%. The result, if greater than 0, is
        then divided equally between all images with omitted percentages. In the
        last example, the sum of both percentages is not 100%, and therefore
        both images include their respective opacities. If no percentages are
        declared and three images are included, each image will be 33.33%
        opaque. The two following are lines (almost) identical: If no
        percentages are declared, both the images will be 50% opaque, with a
        cross-fade rendering as an even merge of both images. The 50%/50%
        example seen above did not need to have the percentages listed, as when
        a percentage value is omitted, the included percentages are added
        together and subtracted from 100%. The result, if greater than 0, is
        then divided equally between all images with omitted percentages. In the
        last example, the sum of both percentages is not 100%, and therefore
        both images include their respective opacities. If no percentages are
        declared and three images are included, each image will be 33.33%
        opaque. The two following are lines (almost) identical: If no
        percentages are declared, both the images will be 50% opaque, with a
        cross-fade rendering as an even merge of both images. The 50%/50%
        example seen above did not need to have the percentages listed, as when
        a percentage value is omitted, the included percentages are added
        together and subtracted from 100%. The result, if greater than 0, is
        then divided equally between all images with omitted percentages. In the
        last example, the sum of both percentages is not 100%, and therefore
        both images include their respective opacities. If no percentages are
        declared and three images are included, each image will be 33.33%
        opaque. The two following are lines (almost) identical: If no
        percentages are declared, both the images will be 50% opaque, with a
        cross-fade rendering as an even merge of both images. The 50%/50%
        example seen above did not need to have the percentages listed, as when
        a percentage value is omitted, the included percentages are added
        together and subtracted from 100%. The result, if greater than 0, is
        then divided equally between all images with omitted percentages. In the
        last example, the sum of both percentages is not 100%, and therefore
        both images include their respective opacities. If no percentages are
        declared and three images are included, each image will be 33.33%
        opaque. The two following are lines (almost) identical: If no
        percentages are declared, both the images will be 50% opaque, with a
        cross-fade rendering as an even merge of both images. The 50%/50%
        example seen above did not need to have the percentages listed, as when
        a percentage value is omitted, the included percentages are added
        together and subtracted from 100%. The result, if greater than 0, is
        then divided equally between all images with omitted percentages. In the
        last example, the sum of both percentages is not 100%, and therefore
        both images include their respective opacities. If no percentages are
        declared and three images are included, each image will be 33.33%
        opaque. The two following are lines (almost) identical: If no
        percentages are declared, both the images will be 50% opaque, with a
        cross-fade rendering as an even merge of both images. The 50%/50%
        example seen above did not need to have the percentages listed, as when
        a percentage value is omitted, the included percentages are added
        together and subtracted from 100%. The result, if greater than 0, is
        then divided equally between all images with omitted percentages. In the
        last example, the sum of both percentages is not 100%, and therefore
        both images include their respective opacities. If no percentages are
        declared and three images are included, each image will be 33.33%
        opaque. The two following are lines (almost) identical:If no percentages
        are declared, both the images will be 50% opaque, with a cross-fade
        rendering as an even merge of both images. The 50%/50% example seen
        above did not need to have the percentages listed, as when a percentage
        value is omitted, the included percentages are added together and
        subtracted from 100%. The result, if greater than 0, is then divided
        equally between all images with omitted percentages. In the last
        example, the sum of both percentages is not 100%, and therefore both
        images include their respective opacities. If no percentages are
        declared and three images are included, each image will be 33.33%
        opaque. The two following are lines (almost) identical: If no
        percentages are declared, both the images will be 50% opaque, with a
        cross-fade rendering as an even merge of both images. The 50%/50%
        example seen above did not need to have the percentages listed, as when
        a percentage value is omitted, the included percentages are added
        together and subtracted from 100%. The result, if greater than 0, is
        then divided equally between all images with omitted percentages. In the
        last example, the sum of both percentages is not 100%, and therefore
        both images include their respective opacities. If no percentages are
        declared and three images are included, each image will be 33.33%
        opaque. The two following are lines (almost) identical: If no
        percentages are declared, both the images will be 50% opaque, with a
        cross-fade rendering as an even merge of both images. The 50%/50%
        example seen above did not need to have the percentages listed, as when
        a percentage value is omitted, the included percentages are added
        together and subtracted from 100%. The result, if greater than 0, is
        then divided equally between all images with omitted percentages. In the
        last example, the sum of both percentages is not 100%, and therefore
        both images include their respective opacities. If no percentages are
        declared and three images are included, each image will be 33.33%
        opaque. The two following are lines (almost) identical: If no
        percentages are declared, both the images will be 50% opaque, with a
        cross-fade rendering as an even merge of both images. The 50%/50%
        example seen above did not need to have the percentages listed, as when
        a percentage value is omitted, the included percentages are added
        together and subtracted from 100%. The result, if greater than 0, is
        then divided equally between all images with omitted percentages. In the
        last example, the sum of both percentages is not 100%, and therefore
        both images include their respective opacities. If no percentages are
        declared and three images are included, each image will be 33.33%
        opaque. The two following are lines (almost) identical: If no
        percentages are declared, both the images will be 50% opaque, with a
        cross-fade rendering as an even merge of both images. The 50%/50%
        example seen above did not need to have the percentages listed, as when
        a percentage value is omitted, the included percentages are added
        together and subtracted from 100%. The result, if greater than 0, is
        then divided equally between all images with omitted percentages. In the
        last example, the sum of both percentages is not 100%, and therefore
        both images include their respective opacities. If no percentages are
        declared and three images are included, each image will be 33.33%
        opaque. The two following are lines (almost) identical: If no
        percentages are declared, both the images will be 50% opaque, with a
        cross-fade rendering as an even merge of both images. The 50%/50%
        example seen above did not need to have the percentages listed, as when
        a percentage value is omitted, the included percentages are added
        together and subtracted from 100%. The result, if greater than 0, is
        then divided equally between all images with omitted percentages. In the
        last example, the sum of both percentages is not 100%, and therefore
        both images include their respective opacities. If no percentages are
        declared and three images are included, each image will be 33.33%
        opaque. The two following are lines (almost) identical: If no
        percentages are declared, both the images will be 50% opaque, with a
        cross-fade rendering as an even merge of both images. The 50%/50%
        example seen above did not need to have the percentages listed, as when
        a percentage value is omitted, the included percentages are added
        together and subtracted from 100%. The result, if greater than 0, is
        then divided equally between all images with omitted percentages. In the
        last example, the sum of both percentages is not 100%, and therefore
        both images include their respective opacities. If no percentages are
        declared and three images are included, each image will be 33.33%
        opaque. The two following are lines (almost) identical: If no
        percentages are declared, both the images will be 50% opaque, with a
        cross-fade rendering as an even merge of both images. The 50%/50%
        example seen above did not need to have the percentages listed, as when
        a percentage value is omitted, the included percentages are added
        together and subtracted from 100%. The result, if greater than 0, is
        then divided equally between all images with omitted percentages. In the
        last example, the sum of both percentages is not 100%, and therefore
        both images include their respective opacities. If no percentages are
        declared and three images are included, each image will be 33.33%
        opaque. The two following are lines (almost) identical: If no
        percentages are declared, both the images will be 50% opaque, with a
        cross-fade rendering as an even merge of both images. The 50%/50%
        example seen above did not need to have the percentages listed, as when
        a percentage value is omitted, the included percentages are added
        together and subtracted from 100%. The result, if greater than 0, is
        then divided equally between all images with omitted percentages. In the
        last example, the sum of both percentages is not 100%, and therefore
        both images include their respective opacities. If no percentages are
        declared and three images are included, each image will be 33.33%
        opaque. The two following are lines (almost) identical: If no
        percentages are declared, both the images will be 50% opaque, with a
        cross-fade rendering as an even merge of both images. The 50%/50%
        example seen above did not need to have the percentages listed, as when
        a percentage value is omitted, the included percentages are added
        together and subtracted from 100%. The result, if greater than 0, is
        then divided equally between all images with omitted percentages. In the
        last example, the sum of both percentages is not 100%, and therefore
        both images include their respective opacities. If no percentages are
        declared and three images are included, each image will be 33.33%
        opaque. The two following are lines (almost) identical: If no
        percentages are declared, both the images will be 50% opaque, with a
        cross-fade rendering as an even merge of both images. The 50%/50%
        example seen above did not need to have the percentages listed, as when
        a percentage value is omitted, the included percentages are added
        together and subtracted from 100%. The result, if greater than 0, is
        then divided equally between all images with omitted percentages. In the
        last example, the sum of both percentages is not 100%, and therefore
        both images include their respective opacities. If no percentages are
        declared and three images are included, each image will be 33.33%
        opaque. The two following are lines (almost) identical: If no
        percentages are declared, both the images will be 50% opaque, with a
        cross-fade rendering as an even merge of both images. The 50%/50%
        example seen above did not need to have the percentages listed, as when
        a percentage value is omitted, the included percentages are added
        together and subtracted from 100%. The result, if greater than 0, is
        then divided equally between all images with omitted percentages. In the
        last example, the sum of both percentages is not 100%, and therefore
        both images include their respective opacities. If no percentages are
        declared and three images are included, each image will be 33.33%
        opaque. The two following are lines (almost) identical: If no
        percentages are declared, both the images will be 50% opaque, with a
        cross-fade rendering as an even merge of both images. The 50%/50%
        example seen above did not need to have the percentages listed, as when
        a percentage value is omitted, the included percentages are added
        together and subtracted from 100%. The result, if greater than 0, is
        then divided equally between all images with omitted percentages. In the
        last example, the sum of both percentages is not 100%, and therefore
        both images include their respective opacities. If no percentages are
        declared and three images are included, each image will be 33.33%
        opaque. The two following are lines (almost) identical:If no percentages
        are declared, both the images will be 50% opaque, with a cross-fade
        rendering as an even merge of both images. The 50%/50% example seen
        above did not need to have the percentages listed, as when a percentage
        value is omitted, the included percentages are added together and
        subtracted from 100%. The result, if greater than 0, is then divided
        equally between all images with omitted percentages. In the last
        example, the sum of both percentages is not 100%, and therefore both
        images include their respective opacities. If no percentages are
        declared and three images are included, each image will be 33.33%
        opaque. The two following are lines (almost) identical: If no
        percentages are declared, both the images will be 50% opaque, with a
        cross-fade rendering as an even merge of both images. The 50%/50%
        example seen above did not need to have the percentages listed, as when
        a percentage value is omitted, the included percentages are added
        together and subtracted from 100%. The result, if greater than 0, is
        then divided equally between all images with omitted percentages. In the
        last example, the sum of both percentages is not 100%, and therefore
        both images include their respective opacities. If no percentages are
        declared and three images are included, each image will be 33.33%
        opaque. The two following are lines (almost) identical: If no
        percentages are declared, both the images will be 50% opaque, with a
        cross-fade rendering as an even merge of both images. The 50%/50%
        example seen above did not need to have the percentages listed, as when
        a percentage value is omitted, the included percentages are added
        together and subtracted from 100%. The result, if greater than 0, is
        then divided equally between all images with omitted percentages. In the
        last example, the sum of both percentages is not 100%, and therefore
        both images include their respective opacities. If no percentages are
        declared and three images are included, each image will be 33.33%
        opaque. The two following are lines (almost) identical: If no
        percentages are declared, both the images will be 50% opaque, with a
        cross-fade rendering as an even merge of both images. The 50%/50%
        example seen above did not need to have the percentages listed, as when
        a percentage value is omitted, the included percentages are added
        together and subtracted from 100%. The result, if greater than 0, is
        then divided equally between all images with omitted percentages. In the
        last example, the sum of both percentages is not 100%, and therefore
        both images include their respective opacities. If no percentages are
        declared and three images are included, each image will be 33.33%
        opaque. The two following are lines (almost) identical: If no
        percentages are declared, both the images will be 50% opaque, with a
        cross-fade rendering as an even merge of both images. The 50%/50%
        example seen above did not need to have the percentages listed, as when
        a percentage value is omitted, the included percentages are added
        together and subtracted from 100%. The result, if greater than 0, is
        then divided equally between all images with omitted percentages. In the
        last example, the sum of both percentages is not 100%, and therefore
        both images include their respective opacities. If no percentages are
        declared and three images are included, each image will be 33.33%
        opaque. The two following are lines (almost) identical: If no
        percentages are declared, both the images will be 50% opaque, with a
        cross-fade rendering as an even merge of both images. The 50%/50%
        example seen above did not need to have the percentages listed, as when
        a percentage value is omitted, the included percentages are added
        together and subtracted from 100%. The result, if greater than 0, is
        then divided equally between all images with omitted percentages. In the
        last example, the sum of both percentages is not 100%, and therefore
        both images include their respective opacities. If no percentages are
        declared and three images are included, each image will be 33.33%
        opaque. The two following are lines (almost) identical: If no
        percentages are declared, both the images will be 50% opaque, with a
        cross-fade rendering as an even merge of both images. The 50%/50%
        example seen above did not need to have the percentages listed, as when
        a percentage value is omitted, the included percentages are added
        together and subtracted from 100%. The result, if greater than 0, is
        then divided equally between all images with omitted percentages. In the
        last example, the sum of both percentages is not 100%, and therefore
        both images include their respective opacities. If no percentages are
        declared and three images are included, each image will be 33.33%
        opaque. The two following are lines (almost) identical: If no
        percentages are declared, both the images will be 50% opaque, with a
        cross-fade rendering as an even merge of both images. The 50%/50%
        example seen above did not need to have the percentages listed, as when
        a percentage value is omitted, the included percentages are added
        together and subtracted from 100%. The result, if greater than 0, is
        then divided equally between all images with omitted percentages. In the
        last example, the sum of both percentages is not 100%, and therefore
        both images include their respective opacities. If no percentages are
        declared and three images are included, each image will be 33.33%
        opaque. The two following are lines (almost) identical: If no
        percentages are declared, both the images will be 50% opaque, with a
        cross-fade rendering as an even merge of both images. The 50%/50%
        example seen above did not need to have the percentages listed, as when
        a percentage value is omitted, the included percentages are added
        together and subtracted from 100%. The result, if greater than 0, is
        then divided equally between all images with omitted percentages. In the
        last example, the sum of both percentages is not 100%, and therefore
        both images include their respective opacities. If no percentages are
        declared and three images are included, each image will be 33.33%
        opaque. The two following are lines (almost) identical: If no
        percentages are declared, both the images will be 50% opaque, with a
        cross-fade rendering as an even merge of both images. The 50%/50%
        example seen above did not need to have the percentages listed, as when
        a percentage value is omitted, the included percentages are added
        together and subtracted from 100%. The result, if greater than 0, is
        then divided equally between all images with omitted percentages. In the
        last example, the sum of both percentages is not 100%, and therefore
        both images include their respective opacities. If no percentages are
        declared and three images are included, each image will be 33.33%
        opaque. The two following are lines (almost) identical: If no
        percentages are declared, both the images will be 50% opaque, with a
        cross-fade rendering as an even merge of both images. The 50%/50%
        example seen above did not need to have the percentages listed, as when
        a percentage value is omitted, the included percentages are added
        together and subtracted from 100%. The result, if greater than 0, is
        then divided equally between all images with omitted percentages. In the
        last example, the sum of both percentages is not 100%, and therefore
        both images include their respective opacities. If no percentages are
        declared and three images are included, each image will be 33.33%
        opaque. The two following are lines (almost) identical: If no
        percentages are declared, both the images will be 50% opaque, with a
        cross-fade rendering as an even merge of both images. The 50%/50%
        example seen above did not need to have the percentages listed, as when
        a percentage value is omitted, the included percentages are added
        together and subtracted from 100%. The result, if greater than 0, is
        then divided equally between all images with omitted percentages. In the
        last example, the sum of both percentages is not 100%, and therefore
        both images include their respective opacities. If no percentages are
        declared and three images are included, each image will be 33.33%
        opaque. The two following are lines (almost) identical: If no
        percentages are declared, both the images will be 50% opaque, with a
        cross-fade rendering as an even merge of both images. The 50%/50%
        example seen above did not need to have the percentages listed, as when
        a percentage value is omitted, the included percentages are added
        together and subtracted from 100%. The result, if greater than 0, is
        then divided equally between all images with omitted percentages. In the
        last example, the sum of both percentages is not 100%, and therefore
        both images include their respective opacities. If no percentages are
        declared and three images are included, each image will be 33.33%
        opaque. The two following are lines (almost) identical:If no percentages
        are declared, both the images will be 50% opaque, with a cross-fade
        rendering as an even merge of both images. The 50%/50% example seen
        above did not need to have the percentages listed, as when a percentage
        value is omitted, the included percentages are added together and
        subtracted from 100%. The result, if greater than 0, is then divided
        equally between all images with omitted percentages. In the last
        example, the sum of both percentages is not 100%, and therefore both
        images include their respective opacities. If no percentages are
        declared and three images are included, each image will be 33.33%
        opaque. The two following are lines (almost) identical: If no
        percentages are declared, both the images will be 50% opaque, with a
        cross-fade rendering as an even merge of both images. The 50%/50%
        example seen above did not need to have the percentages listed, as when
        a percentage value is omitted, the included percentages are added
        together and subtracted from 100%. The result, if greater than 0, is
        then divided equally between all images with omitted percentages. In the
        last example, the sum of both percentages is not 100%, and therefore
        both images include their respective opacities. If no percentages are
        declared and three images are included, each image will be 33.33%
        opaque. The two following are lines (almost) identical: If no
        percentages are declared, both the images will be 50% opaque, with a
        cross-fade rendering as an even merge of both images. The 50%/50%
        example seen above did not need to have the percentages listed, as when
        a percentage value is omitted, the included percentages are added
        together and subtracted from 100%. The result, if greater than 0, is
        then divided equally between all images with omitted percentages. In the
        last example, the sum of both percentages is not 100%, and therefore
        both images include their respective opacities. If no percentages are
        declared and three images are included, each image will be 33.33%
        opaque. The two following are lines (almost) identical: If no
        percentages are declared, both the images will be 50% opaque, with a
        cross-fade rendering as an even merge of both images. The 50%/50%
        example seen above did not need to have the percentages listed, as when
        a percentage value is omitted, the included percentages are added
        together and subtracted from 100%. The result, if greater than 0, is
        then divided equally between all images with omitted percentages. In the
        last example, the sum of both percentages is not 100%, and therefore
        both images include their respective opacities. If no percentages are
        declared and three images are included, each image will be 33.33%
        opaque. The two following are lines (almost) identical: If no
        percentages are declared, both the images will be 50% opaque, with a
        cross-fade rendering as an even merge of both images. The 50%/50%
        example seen above did not need to have the percentages listed, as when
        a percentage value is omitted, the included percentages are added
        together and subtracted from 100%. The result, if greater than 0, is
        then divided equally between all images with omitted percentages. In the
        last example, the sum of both percentages is not 100%, and therefore
        both images include their respective opacities. If no percentages are
        declared and three images are included, each image will be 33.33%
        opaque. The two following are lines (almost) identical: If no
        percentages are declared, both the images will be 50% opaque, with a
        cross-fade rendering as an even merge of both images. The 50%/50%
        example seen above did not need to have the percentages listed, as when
        a percentage value is omitted, the included percentages are added
        together and subtracted from 100%. The result, if greater than 0, is
        then divided equally between all images with omitted percentages. In the
        last example, the sum of both percentages is not 100%, and therefore
        both images include their respective opacities. If no percentages are
        declared and three images are included, each image will be 33.33%
        opaque. The two following are lines (almost) identical: If no
        percentages are declared, both the images will be 50% opaque, with a
        cross-fade rendering as an even merge of both images. The 50%/50%
        example seen above did not need to have the percentages listed, as when
        a percentage value is omitted, the included percentages are added
        together and subtracted from 100%. The result, if greater than 0, is
        then divided equally between all images with omitted percentages. In the
        last example, the sum of both percentages is not 100%, and therefore
        both images include their respective opacities. If no percentages are
        declared and three images are included, each image will be 33.33%
        opaque. The two following are lines (almost) identical: If no
        percentages are declared, both the images will be 50% opaque, with a
        cross-fade rendering as an even merge of both images. The 50%/50%
        example seen above did not need to have the percentages listed, as when
        a percentage value is omitted, the included percentages are added
        together and subtracted from 100%. The result, if greater than 0, is
        then divided equally between all images with omitted percentages. In the
        last example, the sum of both percentages is not 100%, and therefore
        both images include their respective opacities. If no percentages are
        declared and three images are included, each image will be 33.33%
        opaque. The two following are lines (almost) identical: If no
        percentages are declared, both the images will be 50% opaque, with a
        cross-fade rendering as an even merge of both images. The 50%/50%
        example seen above did not need to have the percentages listed, as when
        a percentage value is omitted, the included percentages are added
        together and subtracted from 100%. The result, if greater than 0, is
        then divided equally between all images with omitted percentages. In the
        last example, the sum of both percentages is not 100%, and therefore
        both images include their respective opacities. If no percentages are
        declared and three images are included, each image will be 33.33%
        opaque. The two following are lines (almost) identical: If no
        percentages are declared, both the images will be 50% opaque, with a
        cross-fade rendering as an even merge of both images. The 50%/50%
        example seen above did not need to have the percentages listed, as when
        a percentage value is omitted, the included percentages are added
        together and subtracted from 100%. The result, if greater than 0, is
        then divided equally between all images with omitted percentages. In the
        last example, the sum of both percentages is not 100%, and therefore
        both images include their respective opacities. If no percentages are
        declared and three images are included, each image will be 33.33%
        opaque. The two following are lines (almost) identical: If no
        percentages are declared, both the images will be 50% opaque, with a
        cross-fade rendering as an even merge of both images. The 50%/50%
        example seen above did not need to have the percentages listed, as when
        a percentage value is omitted, the included percentages are added
        together and subtracted from 100%. The result, if greater than 0, is
        then divided equally between all images with omitted percentages. In the
        last example, the sum of both percentages is not 100%, and therefore
        both images include their respective opacities. If no percentages are
        declared and three images are included, each image will be 33.33%
        opaque. The two following are lines (almost) identical: If no
        percentages are declared, both the images will be 50% opaque, with a
        cross-fade rendering as an even merge of both images. The 50%/50%
        example seen above did not need to have the percentages listed, as when
        a percentage value is omitted, the included percentages are added
        together and subtracted from 100%. The result, if greater than 0, is
        then divided equally between all images with omitted percentages. In the
        last example, the sum of both percentages is not 100%, and therefore
        both images include their respective opacities. If no percentages are
        declared and three images are included, each image will be 33.33%
        opaque. The two following are lines (almost) identical: If no
        percentages are declared, both the images will be 50% opaque, with a
        cross-fade rendering as an even merge of both images. The 50%/50%
        example seen above did not need to have the percentages listed, as when
        a percentage value is omitted, the included percentages are added
        together and subtracted from 100%. The result, if greater than 0, is
        then divided equally between all images with omitted percentages. In the
        last example, the sum of both percentages is not 100%, and therefore
        both images include their respective opacities. If no percentages are
        declared and three images are included, each image will be 33.33%
        opaque. The two following are lines (almost) identical:If no percentages
        are declared, both the images will be 50% opaque, with a cross-fade
        rendering as an even merge of both images. The 50%/50% example seen
        above did not need to have the percentages listed, as when a percentage
        value is omitted, the included percentages are added together and
        subtracted from 100%. The result, if greater than 0, is then divided
        equally between all images with omitted percentages. In the last
        example, the sum of both percentages is not 100%, and therefore both
        images include their respective opacities. If no percentages are
        declared and three images are included, each image will be 33.33%
        opaque. The two following are lines (almost) identical: If no
        percentages are declared, both the images will be 50% opaque, with a
        cross-fade rendering as an even merge of both images. The 50%/50%
        example seen above did not need to have the percentages listed, as when
        a percentage value is omitted, the included percentages are added
        together and subtracted from 100%. The result, if greater than 0, is
        then divided equally between all images with omitted percentages. In the
        last example, the sum of both percentages is not 100%, and therefore
        both images include their respective opacities. If no percentages are
        declared and three images are included, each image will be 33.33%
        opaque. The two following are lines (almost) identical: If no
        percentages are declared, both the images will be 50% opaque, with a
        cross-fade rendering as an even merge of both images. The 50%/50%
        example seen above did not need to have the percentages listed, as when
        a percentage value is omitted, the included percentages are added
        together and subtracted from 100%. The result, if greater than 0, is
        then divided equally between all images with omitted percentages. In the
        last example, the sum of both percentages is not 100%, and therefore
        both images include their respective opacities. If no percentages are
        declared and three images are included, each image will be 33.33%
        opaque. The two following are lines (almost) identical: If no
        percentages are declared, both the images will be 50% opaque, with a
        cross-fade rendering as an even merge of both images. The 50%/50%
        example seen above did not need to have the percentages listed, as when
        a percentage value is omitted, the included percentages are added
        together and subtracted from 100%. The result, if greater than 0, is
        then divided equally between all images with omitted percentages. In the
        last example, the sum of both percentages is not 100%, and therefore
        both images include their respective opacities. If no percentages are
        declared and three images are included, each image will be 33.33%
        opaque. The two following are lines (almost) identical: If no
        percentages are declared, both the images will be 50% opaque, with a
        cross-fade rendering as an even merge of both images. The 50%/50%
        example seen above did not need to have the percentages listed, as when
        a percentage value is omitted, the included percentages are added
        together and subtracted from 100%. The result, if greater than 0, is
        then divided equally between all images with omitted percentages. In the
        last example, the sum of both percentages is not 100%, and therefore
        both images include their respective opacities. If no percentages are
        declared and three images are included, each image will be 33.33%
        opaque. The two following are lines (almost) identical: If no
        percentages are declared, both the images will be 50% opaque, with a
        cross-fade rendering as an even merge of both images. The 50%/50%
        example seen above did not need to have the percentages listed, as when
        a percentage value is omitted, the included percentages are added
        together and subtracted from 100%. The result, if greater than 0, is
        then divided equally between all images with omitted percentages. In the
        last example, the sum of both percentages is not 100%, and therefore
        both images include their respective opacities. If no percentages are
        declared and three images are included, each image will be 33.33%
        opaque. The two following are lines (almost) identical: If no
        percentages are declared, both the images will be 50% opaque, with a
        cross-fade rendering as an even merge of both images. The 50%/50%
        example seen above did not need to have the percentages listed, as when
        a percentage value is omitted, the included percentages are added
        together and subtracted from 100%. The result, if greater than 0, is
        then divided equally between all images with omitted percentages. In the
        last example, the sum of both percentages is not 100%, and therefore
        both images include their respective opacities. If no percentages are
        declared and three images are included, each image will be 33.33%
        opaque. The two following are lines (almost) identical: If no
        percentages are declared, both the images will be 50% opaque, with a
        cross-fade rendering as an even merge of both images. The 50%/50%
        example seen above did not need to have the percentages listed, as when
        a percentage value is omitted, the included percentages are added
        together and subtracted from 100%. The result, if greater than 0, is
        then divided equally between all images with omitted percentages. In the
        last example, the sum of both percentages is not 100%, and therefore
        both images include their respective opacities. If no percentages are
        declared and three images are included, each image will be 33.33%
        opaque. The two following are lines (almost) identical: If no
        percentages are declared, both the images will be 50% opaque, with a
        cross-fade rendering as an even merge of both images. The 50%/50%
        example seen above did not need to have the percentages listed, as when
        a percentage value is omitted, the included percentages are added
        together and subtracted from 100%. The result, if greater than 0, is
        then divided equally between all images with omitted percentages. In the
        last example, the sum of both percentages is not 100%, and therefore
        both images include their respective opacities. If no percentages are
        declared and three images are included, each image will be 33.33%
        opaque. The two following are lines (almost) identical: If no
        percentages are declared, both the images will be 50% opaque, with a
        cross-fade rendering as an even merge of both images. The 50%/50%
        example seen above did not need to have the percentages listed, as when
        a percentage value is omitted, the included percentages are added
        together and subtracted from 100%. The result, if greater than 0, is
        then divided equally between all images with omitted percentages. In the
        last example, the sum of both percentages is not 100%, and therefore
        both images include their respective opacities. If no percentages are
        declared and three images are included, each image will be 33.33%
        opaque. The two following are lines (almost) identical: If no
        percentages are declared, both the images will be 50% opaque, with a
        cross-fade rendering as an even merge of both images. The 50%/50%
        example seen above did not need to have the percentages listed, as when
        a percentage value is omitted, the included percentages are added
        together and subtracted from 100%. The result, if greater than 0, is
        then divided equally between all images with omitted percentages. In the
        last example, the sum of both percentages is not 100%, and therefore
        both images include their respective opacities. If no percentages are
        declared and three images are included, each image will be 33.33%
        opaque. The two following are lines (almost) identical: If no
        percentages are declared, both the images will be 50% opaque, with a
        cross-fade rendering as an even merge of both images. The 50%/50%
        example seen above did not need to have the percentages listed, as when
        a percentage value is omitted, the included percentages are added
        together and subtracted from 100%. The result, if greater than 0, is
        then divided equally between all images with omitted percentages. In the
        last example, the sum of both percentages is not 100%, and therefore
        both images include their respective opacities. If no percentages are
        declared and three images are included, each image will be 33.33%
        opaque. The two following are lines (almost) identical: If no
        percentages are declared, both the images will be 50% opaque, with a
        cross-fade rendering as an even merge of both images. The 50%/50%
        example seen above did not need to have the percentages listed, as when
        a percentage value is omitted, the included percentages are added
        together and subtracted from 100%. The result, if greater than 0, is
        then divided equally between all images with omitted percentages. In the
        last example, the sum of both percentages is not 100%, and therefore
        both images include their respective opacities. If no percentages are
        declared and three images are included, each image will be 33.33%
        opaque. The two following are lines (almost) identical:If no percentages
        are declared, both the images will be 50% opaque, with a cross-fade
        rendering as an even merge of both images. The 50%/50% example seen
        above did not need to have the percentages listed, as when a percentage
        value is omitted, the included percentages are added together and
        subtracted from 100%. The result, if greater than 0, is then divided
        equally between all images with omitted percentages. In the last
        example, the sum of both percentages is not 100%, and therefore both
        images include their respective opacities. If no percentages are
        declared and three images are included, each image will be 33.33%
        opaque. The two following are lines (almost) identical: If no
        percentages are declared, both the images will be 50% opaque, with a
        cross-fade rendering as an even merge of both images. The 50%/50%
        example seen above did not need to have the percentages listed, as when
        a percentage value is omitted, the included percentages are added
        together and subtracted from 100%. The result, if greater than 0, is
        then divided equally between all images with omitted percentages. In the
        last example, the sum of both percentages is not 100%, and therefore
        both images include their respective opacities. If no percentages are
        declared and three images are included, each image will be 33.33%
        opaque. The two following are lines (almost) identical: If no
        percentages are declared, both the images will be 50% opaque, with a
        cross-fade rendering as an even merge of both images. The 50%/50%
        example seen above did not need to have the percentages listed, as when
        a percentage value is omitted, the included percentages are added
        together and subtracted from 100%. The result, if greater than 0, is
        then divided equally between all images with omitted percentages. In the
        last example, the sum of both percentages is not 100%, and therefore
        both images include their respective opacities. If no percentages are
        declared and three images are included, each image will be 33.33%
        opaque. The two following are lines (almost) identical: If no
        percentages are declared, both the images will be 50% opaque, with a
        cross-fade rendering as an even merge of both images. The 50%/50%
        example seen above did not need to have the percentages listed, as when
        a percentage value is omitted, the included percentages are added
        together and subtracted from 100%. The result, if greater than 0, is
        then divided equally between all images with omitted percentages. In the
        last example, the sum of both percentages is not 100%, and therefore
        both images include their respective opacities. If no percentages are
        declared and three images are included, each image will be 33.33%
        opaque. The two following are lines (almost) identical: If no
        percentages are declared, both the images will be 50% opaque, with a
        cross-fade rendering as an even merge of both images. The 50%/50%
        example seen above did not need to have the percentages listed, as when
        a percentage value is omitted, the included percentages are added
        together and subtracted from 100%. The result, if greater than 0, is
        then divided equally between all images with omitted percentages. In the
        last example, the sum of both percentages is not 100%, and therefore
        both images include their respective opacities. If no percentages are
        declared and three images are included, each image will be 33.33%
        opaque. The two following are lines (almost) identical: If no
        percentages are declared, both the images will be 50% opaque, with a
        cross-fade rendering as an even merge of both images. The 50%/50%
        example seen above did not need to have the percentages listed, as when
        a percentage value is omitted, the included percentages are added
        together and subtracted from 100%. The result, if greater than 0, is
        then divided equally between all images with omitted percentages. In the
        last example, the sum of both percentages is not 100%, and therefore
        both images include their respective opacities. If no percentages are
        declared and three images are included, each image will be 33.33%
        opaque. The two following are lines (almost) identical: If no
        percentages are declared, both the images will be 50% opaque, with a
        cross-fade rendering as an even merge of both images. The 50%/50%
        example seen above did not need to have the percentages listed, as when
        a percentage value is omitted, the included percentages are added
        together and subtracted from 100%. The result, if greater than 0, is
        then divided equally between all images with omitted percentages. In the
        last example, the sum of both percentages is not 100%, and therefore
        both images include their respective opacities. If no percentages are
        declared and three images are included, each image will be 33.33%
        opaque. The two following are lines (almost) identical: If no
        percentages are declared, both the images will be 50% opaque, with a
        cross-fade rendering as an even merge of both images. The 50%/50%
        example seen above did not need to have the percentages listed, as when
        a percentage value is omitted, the included percentages are added
        together and subtracted from 100%. The result, if greater than 0, is
        then divided equally between all images with omitted percentages. In the
        last example, the sum of both percentages is not 100%, and therefore
        both images include their respective opacities. If no percentages are
        declared and three images are included, each image will be 33.33%
        opaque. The two following are lines (almost) identical: If no
        percentages are declared, both the images will be 50% opaque, with a
        cross-fade rendering as an even merge of both images. The 50%/50%
        example seen above did not need to have the percentages listed, as when
        a percentage value is omitted, the included percentages are added
        together and subtracted from 100%. The result, if greater than 0, is
        then divided equally between all images with omitted percentages. In the
        last example, the sum of both percentages is not 100%, and therefore
        both images include their respective opacities. If no percentages are
        declared and three images are included, each image will be 33.33%
        opaque. The two following are lines (almost) identical: If no
        percentages are declared, both the images will be 50% opaque, with a
        cross-fade rendering as an even merge of both images. The 50%/50%
        example seen above did not need to have the percentages listed, as when
        a percentage value is omitted, the included percentages are added
        together and subtracted from 100%. The result, if greater than 0, is
        then divided equally between all images with omitted percentages. In the
        last example, the sum of both percentages is not 100%, and therefore
        both images include their respective opacities. If no percentages are
        declared and three images are included, each image will be 33.33%
        opaque. The two following are lines (almost) identical: If no
        percentages are declared, both the images will be 50% opaque, with a
        cross-fade rendering as an even merge of both images. The 50%/50%
        example seen above did not need to have the percentages listed, as when
        a percentage value is omitted, the included percentages are added
        together and subtracted from 100%. The result, if greater than 0, is
        then divided equally between all images with omitted percentages. In the
        last example, the sum of both percentages is not 100%, and therefore
        both images include their respective opacities. If no percentages are
        declared and three images are included, each image will be 33.33%
        opaque. The two following are lines (almost) identical: If no
        percentages are declared, both the images will be 50% opaque, with a
        cross-fade rendering as an even merge of both images. The 50%/50%
        example seen above did not need to have the percentages listed, as when
        a percentage value is omitted, the included percentages are added
        together and subtracted from 100%. The result, if greater than 0, is
        then divided equally between all images with omitted percentages. In the
        last example, the sum of both percentages is not 100%, and therefore
        both images include their respective opacities. If no percentages are
        declared and three images are included, each image will be 33.33%
        opaque. The two following are lines (almost) identical: If no
        percentages are declared, both the images will be 50% opaque, with a
        cross-fade rendering as an even merge of both images. The 50%/50%
        example seen above did not need to have the percentages listed, as when
        a percentage value is omitted, the included percentages are added
        together and subtracted from 100%. The result, if greater than 0, is
        then divided equally between all images with omitted percentages. In the
        last example, the sum of both percentages is not 100%, and therefore
        both images include their respective opacities. If no percentages are
        declared and three images are included, each image will be 33.33%
        opaque. The two following are lines (almost) identical:If no percentages
        are declared, both the images will be 50% opaque, with a cross-fade
        rendering as an even merge of both images. The 50%/50% example seen
        above did not need to have the percentages listed, as when a percentage
        value is omitted, the included percentages are added together and
        subtracted from 100%. The result, if greater than 0, is then divided
        equally between all images with omitted percentages. In the last
        example, the sum of both percentages is not 100%, and therefore both
        images include their respective opacities. If no percentages are
        declared and three images are included, each image will be 33.33%
        opaque. The two following are lines (almost) identical: If no
        percentages are declared, both the images will be 50% opaque, with a
        cross-fade rendering as an even merge of both images. The 50%/50%
        example seen above did not need to have the percentages listed, as when
        a percentage value is omitted, the included percentages are added
        together and subtracted from 100%. The result, if greater than 0, is
        then divided equally between all images with omitted percentages. In the
        last example, the sum of both percentages is not 100%, and therefore
        both images include their respective opacities. If no percentages are
        declared and three images are included, each image will be 33.33%
        opaque. The two following are lines (almost) identical: If no
        percentages are declared, both the images will be 50% opaque, with a
        cross-fade rendering as an even merge of both images. The 50%/50%
        example seen above did not need to have the percentages listed, as when
        a percentage value is omitted, the included percentages are added
        together and subtracted from 100%. The result, if greater than 0, is
        then divided equally between all images with omitted percentages. In the
        last example, the sum of both percentages is not 100%, and therefore
        both images include their respective opacities. If no percentages are
        declared and three images are included, each image will be 33.33%
        opaque. The two following are lines (almost) identical: If no
        percentages are declared, both the images will be 50% opaque, with a
        cross-fade rendering as an even merge of both images. The 50%/50%
        example seen above did not need to have the percentages listed, as when
        a percentage value is omitted, the included percentages are added
        together and subtracted from 100%. The result, if greater than 0, is
        then divided equally between all images with omitted percentages. In the
        last example, the sum of both percentages is not 100%, and therefore
        both images include their respective opacities. If no percentages are
        declared and three images are included, each image will be 33.33%
        opaque. The two following are lines (almost) identical: If no
        percentages are declared, both the images will be 50% opaque, with a
        cross-fade rendering as an even merge of both images. The 50%/50%
        example seen above did not need to have the percentages listed, as when
        a percentage value is omitted, the included percentages are added
        together and subtracted from 100%. The result, if greater than 0, is
        then divided equally between all images with omitted percentages. In the
        last example, the sum of both percentages is not 100%, and therefore
        both images include their respective opacities. If no percentages are
        declared and three images are included, each image will be 33.33%
        opaque. The two following are lines (almost) identical: If no
        percentages are declared, both the images will be 50% opaque, with a
        cross-fade rendering as an even merge of both images. The 50%/50%
        example seen above did not need to have the percentages listed, as when
        a percentage value is omitted, the included percentages are added
        together and subtracted from 100%. The result, if greater than 0, is
        then divided equally between all images with omitted percentages. In the
        last example, the sum of both percentages is not 100%, and therefore
        both images include their respective opacities. If no percentages are
        declared and three images are included, each image will be 33.33%
        opaque. The two following are lines (almost) identical: If no
        percentages are declared, both the images will be 50% opaque, with a
        cross-fade rendering as an even merge of both images. The 50%/50%
        example seen above did not need to have the percentages listed, as when
        a percentage value is omitted, the included percentages are added
        together and subtracted from 100%. The result, if greater than 0, is
        then divided equally between all images with omitted percentages. In the
        last example, the sum of both percentages is not 100%, and therefore
        both images include their respective opacities. If no percentages are
        declared and three images are included, each image will be 33.33%
        opaque. The two following are lines (almost) identical: If no
        percentages are declared, both the images will be 50% opaque, with a
        cross-fade rendering as an even merge of both images. The 50%/50%
        example seen above did not need to have the percentages listed, as when
        a percentage value is omitted, the included percentages are added
        together and subtracted from 100%. The result, if greater than 0, is
        then divided equally between all images with omitted percentages. In the
        last example, the sum of both percentages is not 100%, and therefore
        both images include their respective opacities. If no percentages are
        declared and three images are included, each image will be 33.33%
        opaque. The two following are lines (almost) identical: If no
        percentages are declared, both the images will be 50% opaque, with a
        cross-fade rendering as an even merge of both images. The 50%/50%
        example seen above did not need to have the percentages listed, as when
        a percentage value is omitted, the included percentages are added
        together and subtracted from 100%. The result, if greater than 0, is
        then divided equally between all images with omitted percentages. In the
        last example, the sum of both percentages is not 100%, and therefore
        both images include their respective opacities. If no percentages are
        declared and three images are included, each image will be 33.33%
        opaque. The two following are lines (almost) identical: If no
        percentages are declared, both the images will be 50% opaque, with a
        cross-fade rendering as an even merge of both images. The 50%/50%
        example seen above did not need to have the percentages listed, as when
        a percentage value is omitted, the included percentages are added
        together and subtracted from 100%. The result, if greater than 0, is
        then divided equally between all images with omitted percentages. In the
        last example, the sum of both percentages is not 100%, and therefore
        both images include their respective opacities. If no percentages are
        declared and three images are included, each image will be 33.33%
        opaque. The two following are lines (almost) identical: If no
        percentages are declared, both the images will be 50% opaque, with a
        cross-fade rendering as an even merge of both images. The 50%/50%
        example seen above did not need to have the percentages listed, as when
        a percentage value is omitted, the included percentages are added
        together and subtracted from 100%. The result, if greater than 0, is
        then divided equally between all images with omitted percentages. In the
        last example, the sum of both percentages is not 100%, and therefore
        both images include their respective opacities. If no percentages are
        declared and three images are included, each image will be 33.33%
        opaque. The two following are lines (almost) identical: If no
        percentages are declared, both the images will be 50% opaque, with a
        cross-fade rendering as an even merge of both images. The 50%/50%
        example seen above did not need to have the percentages listed, as when
        a percentage value is omitted, the included percentages are added
        together and subtracted from 100%. The result, if greater than 0, is
        then divided equally between all images with omitted percentages. In the
        last example, the sum of both percentages is not 100%, and therefore
        both images include their respective opacities. If no percentages are
        declared and three images are included, each image will be 33.33%
        opaque. The two following are lines (almost) identical: If no
        percentages are declared, both the images will be 50% opaque, with a
        cross-fade rendering as an even merge of both images. The 50%/50%
        example seen above did not need to have the percentages listed, as when
        a percentage value is omitted, the included percentages are added
        together and subtracted from 100%. The result, if greater than 0, is
        then divided equally between all images with omitted percentages. In the
        last example, the sum of both percentages is not 100%, and therefore
        both images include their respective opacities. If no percentages are
        declared and three images are included, each image will be 33.33%
        opaque. The two following are lines (almost) identical:If no percentages
        are declared, both the images will be 50% opaque, with a cross-fade
        rendering as an even merge of both images. The 50%/50% example seen
        above did not need to have the percentages listed, as when a percentage
        value is omitted, the included percentages are added together and
        subtracted from 100%. The result, if greater than 0, is then divided
        equally between all images with omitted percentages. In the last
        example, the sum of both percentages is not 100%, and therefore both
        images include their respective opacities. If no percentages are
        declared and three images are included, each image will be 33.33%
        opaque. The two following are lines (almost) identical: If no
        percentages are declared, both the images will be 50% opaque, with a
        cross-fade rendering as an even merge of both images. The 50%/50%
        example seen above did not need to have the percentages listed, as when
        a percentage value is omitted, the included percentages are added
        together and subtracted from 100%. The result, if greater than 0, is
        then divided equally between all images with omitted percentages. In the
        last example, the sum of both percentages is not 100%, and therefore
        both images include their respective opacities. If no percentages are
        declared and three images are included, each image will be 33.33%
        opaque. The two following are lines (almost) identical: If no
        percentages are declared, both the images will be 50% opaque, with a
        cross-fade rendering as an even merge of both images. The 50%/50%
        example seen above did not need to have the percentages listed, as when
        a percentage value is omitted, the included percentages are added
        together and subtracted from 100%. The result, if greater than 0, is
        then divided equally between all images with omitted percentages. In the
        last example, the sum of both percentages is not 100%, and therefore
        both images include their respective opacities. If no percentages are
        declared and three images are included, each image will be 33.33%
        opaque. The two following are lines (almost) identical: If no
        percentages are declared, both the images will be 50% opaque, with a
        cross-fade rendering as an even merge of both images. The 50%/50%
        example seen above did not need to have the percentages listed, as when
        a percentage value is omitted, the included percentages are added
        together and subtracted from 100%. The result, if greater than 0, is
        then divided equally between all images with omitted percentages. In the
        last example, the sum of both percentages is not 100%, and therefore
        both images include their respective opacities. If no percentages are
        declared and three images are included, each image will be 33.33%
        opaque. The two following are lines (almost) identical: If no
        percentages are declared, both the images will be 50% opaque, with a
        cross-fade rendering as an even merge of both images. The 50%/50%
        example seen above did not need to have the percentages listed, as when
        a percentage value is omitted, the included percentages are added
        together and subtracted from 100%. The result, if greater than 0, is
        then divided equally between all images with omitted percentages. In the
        last example, the sum of both percentages is not 100%, and therefore
        both images include their respective opacities. If no percentages are
        declared and three images are included, each image will be 33.33%
        opaque. The two following are lines (almost) identical: If no
        percentages are declared, both the images will be 50% opaque, with a
        cross-fade rendering as an even merge of both images. The 50%/50%
        example seen above did not need to have the percentages listed, as when
        a percentage value is omitted, the included percentages are added
        together and subtracted from 100%. The result, if greater than 0, is
        then divided equally between all images with omitted percentages. In the
        last example, the sum of both percentages is not 100%, and therefore
        both images include their respective opacities. If no percentages are
        declared and three images are included, each image will be 33.33%
        opaque. The two following are lines (almost) identical: If no
        percentages are declared, both the images will be 50% opaque, with a
        cross-fade rendering as an even merge of both images. The 50%/50%
        example seen above did not need to have the percentages listed, as when
        a percentage value is omitted, the included percentages are added
        together and subtracted from 100%. The result, if greater than 0, is
        then divided equally between all images with omitted percentages. In the
        last example, the sum of both percentages is not 100%, and therefore
        both images include their respective opacities. If no percentages are
        declared and three images are included, each image will be 33.33%
        opaque. The two following are lines (almost) identical: If no
        percentages are declared, both the images will be 50% opaque, with a
        cross-fade rendering as an even merge of both images. The 50%/50%
        example seen above did not need to have the percentages listed, as when
        a percentage value is omitted, the included percentages are added
        together and subtracted from 100%. The result, if greater than 0, is
        then divided equally between all images with omitted percentages. In the
        last example, the sum of both percentages is not 100%, and therefore
        both images include their respective opacities. If no percentages are
        declared and three images are included, each image will be 33.33%
        opaque. The two following are lines (almost) identical: If no
        percentages are declared, both the images will be 50% opaque, with a
        cross-fade rendering as an even merge of both images. The 50%/50%
        example seen above did not need to have the percentages listed, as when
        a percentage value is omitted, the included percentages are added
        together and subtracted from 100%. The result, if greater than 0, is
        then divided equally between all images with omitted percentages. In the
        last example, the sum of both percentages is not 100%, and therefore
        both images include their respective opacities. If no percentages are
        declared and three images are included, each image will be 33.33%
        opaque. The two following are lines (almost) identical: If no
        percentages are declared, both the images will be 50% opaque, with a
        cross-fade rendering as an even merge of both images. The 50%/50%
        example seen above did not need to have the percentages listed, as when
        a percentage value is omitted, the included percentages are added
        together and subtracted from 100%. The result, if greater than 0, is
        then divided equally between all images with omitted percentages. In the
        last example, the sum of both percentages is not 100%, and therefore
        both images include their respective opacities. If no percentages are
        declared and three images are included, each image will be 33.33%
        opaque. The two following are lines (almost) identical: If no
        percentages are declared, both the images will be 50% opaque, with a
        cross-fade rendering as an even merge of both images. The 50%/50%
        example seen above did not need to have the percentages listed, as when
        a percentage value is omitted, the included percentages are added
        together and subtracted from 100%. The result, if greater than 0, is
        then divided equally between all images with omitted percentages. In the
        last example, the sum of both percentages is not 100%, and therefore
        both images include their respective opacities. If no percentages are
        declared and three images are included, each image will be 33.33%
        opaque. The two following are lines (almost) identical: If no
        percentages are declared, both the images will be 50% opaque, with a
        cross-fade rendering as an even merge of both images. The 50%/50%
        example seen above did not need to have the percentages listed, as when
        a percentage value is omitted, the included percentages are added
        together and subtracted from 100%. The result, if greater than 0, is
        then divided equally between all images with omitted percentages. In the
        last example, the sum of both percentages is not 100%, and therefore
        both images include their respective opacities. If no percentages are
        declared and three images are included, each image will be 33.33%
        opaque. The two following are lines (almost) identical: If no
        percentages are declared, both the images will be 50% opaque, with a
        cross-fade rendering as an even merge of both images. The 50%/50%
        example seen above did not need to have the percentages listed, as when
        a percentage value is omitted, the included percentages are added
        together and subtracted from 100%. The result, if greater than 0, is
        then divided equally between all images with omitted percentages. In the
        last example, the sum of both percentages is not 100%, and therefore
        both images include their respective opacities. If no percentages are
        declared and three images are included, each image will be 33.33%
        opaque. The two following are lines (almost) identical:If no percentages
        are declared, both the images will be 50% opaque, with a cross-fade
        rendering as an even merge of both images. The 50%/50% example seen
        above did not need to have the percentages listed, as when a percentage
        value is omitted, the included percentages are added together and
        subtracted from 100%. The result, if greater than 0, is then divided
        equally between all images with omitted percentages. In the last
        example, the sum of both percentages is not 100%, and therefore both
        images include their respective opacities. If no percentages are
        declared and three images are included, each image will be 33.33%
        opaque. The two following are lines (almost) identical: If no
        percentages are declared, both the images will be 50% opaque, with a
        cross-fade rendering as an even merge of both images. The 50%/50%
        example seen above did not need to have the percentages listed, as when
        a percentage value is omitted, the included percentages are added
        together and subtracted from 100%. The result, if greater than 0, is
        then divided equally between all images with omitted percentages. In the
        last example, the sum of both percentages is not 100%, and therefore
        both images include their respective opacities. If no percentages are
        declared and three images are included, each image will be 33.33%
        opaque. The two following are lines (almost) identical: If no
        percentages are declared, both the images will be 50% opaque, with a
        cross-fade rendering as an even merge of both images. The 50%/50%
        example seen above did not need to have the percentages listed, as when
        a percentage value is omitted, the included percentages are added
        together and subtracted from 100%. The result, if greater than 0, is
        then divided equally between all images with omitted percentages. In the
        last example, the sum of both percentages is not 100%, and therefore
        both images include their respective opacities. If no percentages are
        declared and three images are included, each image will be 33.33%
        opaque. The two following are lines (almost) identical: If no
        percentages are declared, both the images will be 50% opaque, with a
        cross-fade rendering as an even merge of both images. The 50%/50%
        example seen above did not need to have the percentages listed, as when
        a percentage value is omitted, the included percentages are added
        together and subtracted from 100%. The result, if greater than 0, is
        then divided equally between all images with omitted percentages. In the
        last example, the sum of both percentages is not 100%, and therefore
        both images include their respective opacities. If no percentages are
        declared and three images are included, each image will be 33.33%
        opaque. The two following are lines (almost) identical: If no
        percentages are declared, both the images will be 50% opaque, with a
        cross-fade rendering as an even merge of both images. The 50%/50%
        example seen above did not need to have the percentages listed, as when
        a percentage value is omitted, the included percentages are added
        together and subtracted from 100%. The result, if greater than 0, is
        then divided equally between all images with omitted percentages. In the
        last example, the sum of both percentages is not 100%, and therefore
        both images include their respective opacities. If no percentages are
        declared and three images are included, each image will be 33.33%
        opaque. The two following are lines (almost) identical: If no
        percentages are declared, both the images will be 50% opaque, with a
        cross-fade rendering as an even merge of both images. The 50%/50%
        example seen above did not need to have the percentages listed, as when
        a percentage value is omitted, the included percentages are added
        together and subtracted from 100%. The result, if greater than 0, is
        then divided equally between all images with omitted percentages. In the
        last example, the sum of both percentages is not 100%, and therefore
        both images include their respective opacities. If no percentages are
        declared and three images are included, each image will be 33.33%
        opaque. The two following are lines (almost) identical: If no
        percentages are declared, both the images will be 50% opaque, with a
        cross-fade rendering as an even merge of both images. The 50%/50%
        example seen above did not need to have the percentages listed, as when
        a percentage value is omitted, the included percentages are added
        together and subtracted from 100%. The result, if greater than 0, is
        then divided equally between all images with omitted percentages. In the
        last example, the sum of both percentages is not 100%, and therefore
        both images include their respective opacities. If no percentages are
        declared and three images are included, each image will be 33.33%
        opaque. The two following are lines (almost) identical: If no
        percentages are declared, both the images will be 50% opaque, with a
        cross-fade rendering as an even merge of both images. The 50%/50%
        example seen above did not need to have the percentages listed, as when
        a percentage value is omitted, the included percentages are added
        together and subtracted from 100%. The result, if greater than 0, is
        then divided equally between all images with omitted percentages. In the
        last example, the sum of both percentages is not 100%, and therefore
        both images include their respective opacities. If no percentages are
        declared and three images are included, each image will be 33.33%
        opaque. The two following are lines (almost) identical: If no
        percentages are declared, both the images will be 50% opaque, with a
        cross-fade rendering as an even merge of both images. The 50%/50%
        example seen above did not need to have the percentages listed, as when
        a percentage value is omitted, the included percentages are added
        together and subtracted from 100%. The result, if greater than 0, is
        then divided equally between all images with omitted percentages. In the
        last example, the sum of both percentages is not 100%, and therefore
        both images include their respective opacities. If no percentages are
        declared and three images are included, each image will be 33.33%
        opaque. The two following are lines (almost) identical: If no
        percentages are declared, both the images will be 50% opaque, with a
        cross-fade rendering as an even merge of both images. The 50%/50%
        example seen above did not need to have the percentages listed, as when
        a percentage value is omitted, the included percentages are added
        together and subtracted from 100%. The result, if greater than 0, is
        then divided equally between all images with omitted percentages. In the
        last example, the sum of both percentages is not 100%, and therefore
        both images include their respective opacities. If no percentages are
        declared and three images are included, each image will be 33.33%
        opaque. The two following are lines (almost) identical: If no
        percentages are declared, both the images will be 50% opaque, with a
        cross-fade rendering as an even merge of both images. The 50%/50%
        example seen above did not need to have the percentages listed, as when
        a percentage value is omitted, the included percentages are added
        together and subtracted from 100%. The result, if greater than 0, is
        then divided equally between all images with omitted percentages. In the
        last example, the sum of both percentages is not 100%, and therefore
        both images include their respective opacities. If no percentages are
        declared and three images are included, each image will be 33.33%
        opaque. The two following are lines (almost) identical: If no
        percentages are declared, both the images will be 50% opaque, with a
        cross-fade rendering as an even merge of both images. The 50%/50%
        example seen above did not need to have the percentages listed, as when
        a percentage value is omitted, the included percentages are added
        together and subtracted from 100%. The result, if greater than 0, is
        then divided equally between all images with omitted percentages. In the
        last example, the sum of both percentages is not 100%, and therefore
        both images include their respective opacities. If no percentages are
        declared and three images are included, each image will be 33.33%
        opaque. The two following are lines (almost) identical: If no
        percentages are declared, both the images will be 50% opaque, with a
        cross-fade rendering as an even merge of both images. The 50%/50%
        example seen above did not need to have the percentages listed, as when
        a percentage value is omitted, the included percentages are added
        together and subtracted from 100%. The result, if greater than 0, is
        then divided equally between all images with omitted percentages. In the
        last example, the sum of both percentages is not 100%, and therefore
        both images include their respective opacities. If no percentages are
        declared and three images are included, each image will be 33.33%
        opaque. The two following are lines (almost) identical:If no percentages
        are declared, both the images will be 50% opaque, with a cross-fade
        rendering as an even merge of both images. The 50%/50% example seen
        above did not need to have the percentages listed, as when a percentage
        value is omitted, the included percentages are added together and
        subtracted from 100%. The result, if greater than 0, is then divided
        equally between all images with omitted percentages. In the last
        example, the sum of both percentages is not 100%, and therefore both
        images include their respective opacities. If no percentages are
        declared and three images are included, each image will be 33.33%
        opaque. The two following are lines (almost) identical: If no
        percentages are declared, both the images will be 50% opaque, with a
        cross-fade rendering as an even merge of both images. The 50%/50%
        example seen above did not need to have the percentages listed, as when
        a percentage value is omitted, the included percentages are added
        together and subtracted from 100%. The result, if greater than 0, is
        then divided equally between all images with omitted percentages. In the
        last example, the sum of both percentages is not 100%, and therefore
        both images include their respective opacities. If no percentages are
        declared and three images are included, each image will be 33.33%
        opaque. The two following are lines (almost) identical: If no
        percentages are declared, both the images will be 50% opaque, with a
        cross-fade rendering as an even merge of both images. The 50%/50%
        example seen above did not need to have the percentages listed, as when
        a percentage value is omitted, the included percentages are added
        together and subtracted from 100%. The result, if greater than 0, is
        then divided equally between all images with omitted percentages. In the
        last example, the sum of both percentages is not 100%, and therefore
        both images include their respective opacities. If no percentages are
        declared and three images are included, each image will be 33.33%
        opaque. The two following are lines (almost) identical: If no
        percentages are declared, both the images will be 50% opaque, with a
        cross-fade rendering as an even merge of both images. The 50%/50%
        example seen above did not need to have the percentages listed, as when
        a percentage value is omitted, the included percentages are added
        together and subtracted from 100%. The result, if greater than 0, is
        then divided equally between all images with omitted percentages. In the
        last example, the sum of both percentages is not 100%, and therefore
        both images include their respective opacities. If no percentages are
        declared and three images are included, each image will be 33.33%
        opaque. The two following are lines (almost) identical: If no
        percentages are declared, both the images will be 50% opaque, with a
        cross-fade rendering as an even merge of both images. The 50%/50%
        example seen above did not need to have the percentages listed, as when
        a percentage value is omitted, the included percentages are added
        together and subtracted from 100%. The result, if greater than 0, is
        then divided equally between all images with omitted percentages. In the
        last example, the sum of both percentages is not 100%, and therefore
        both images include their respective opacities. If no percentages are
        declared and three images are included, each image will be 33.33%
        opaque. The two following are lines (almost) identical: If no
        percentages are declared, both the images will be 50% opaque, with a
        cross-fade rendering as an even merge of both images. The 50%/50%
        example seen above did not need to have the percentages listed, as when
        a percentage value is omitted, the included percentages are added
        together and subtracted from 100%. The result, if greater than 0, is
        then divided equally between all images with omitted percentages. In the
        last example, the sum of both percentages is not 100%, and therefore
        both images include their respective opacities. If no percentages are
        declared and three images are included, each image will be 33.33%
        opaque. The two following are lines (almost) identical: If no
        percentages are declared, both the images will be 50% opaque, with a
        cross-fade rendering as an even merge of both images. The 50%/50%
        example seen above did not need to have the percentages listed, as when
        a percentage value is omitted, the included percentages are added
        together and subtracted from 100%. The result, if greater than 0, is
        then divided equally between all images with omitted percentages. In the
        last example, the sum of both percentages is not 100%, and therefore
        both images include their respective opacities. If no percentages are
        declared and three images are included, each image will be 33.33%
        opaque. The two following are lines (almost) identical: If no
        percentages are declared, both the images will be 50% opaque, with a
        cross-fade rendering as an even merge of both images. The 50%/50%
        example seen above did not need to have the percentages listed, as when
        a percentage value is omitted, the included percentages are added
        together and subtracted from 100%. The result, if greater than 0, is
        then divided equally between all images with omitted percentages. In the
        last example, the sum of both percentages is not 100%, and therefore
        both images include their respective opacities. If no percentages are
        declared and three images are included, each image will be 33.33%
        opaque. The two following are lines (almost) identical: If no
        percentages are declared, both the images will be 50% opaque, with a
        cross-fade rendering as an even merge of both images. The 50%/50%
        example seen above did not need to have the percentages listed, as when
        a percentage value is omitted, the included percentages are added
        together and subtracted from 100%. The result, if greater than 0, is
        then divided equally between all images with omitted percentages. In the
        last example, the sum of both percentages is not 100%, and therefore
        both images include their respective opacities. If no percentages are
        declared and three images are included, each image will be 33.33%
        opaque. The two following are lines (almost) identical: If no
        percentages are declared, both the images will be 50% opaque, with a
        cross-fade rendering as an even merge of both images. The 50%/50%
        example seen above did not need to have the percentages listed, as when
        a percentage value is omitted, the included percentages are added
        together and subtracted from 100%. The result, if greater than 0, is
        then divided equally between all images with omitted percentages. In the
        last example, the sum of both percentages is not 100%, and therefore
        both images include their respective opacities. If no percentages are
        declared and three images are included, each image will be 33.33%
        opaque. The two following are lines (almost) identical: If no
        percentages are declared, both the images will be 50% opaque, with a
        cross-fade rendering as an even merge of both images. The 50%/50%
        example seen above did not need to have the percentages listed, as when
        a percentage value is omitted, the included percentages are added
        together and subtracted from 100%. The result, if greater than 0, is
        then divided equally between all images with omitted percentages. In the
        last example, the sum of both percentages is not 100%, and therefore
        both images include their respective opacities. If no percentages are
        declared and three images are included, each image will be 33.33%
        opaque. The two following are lines (almost) identical: If no
        percentages are declared, both the images will be 50% opaque, with a
        cross-fade rendering as an even merge of both images. The 50%/50%
        example seen above did not need to have the percentages listed, as when
        a percentage value is omitted, the included percentages are added
        together and subtracted from 100%. The result, if greater than 0, is
        then divided equally between all images with omitted percentages. In the
        last example, the sum of both percentages is not 100%, and therefore
        both images include their respective opacities. If no percentages are
        declared and three images are included, each image will be 33.33%
        opaque. The two following are lines (almost) identical: If no
        percentages are declared, both the images will be 50% opaque, with a
        cross-fade rendering as an even merge of both images. The 50%/50%
        example seen above did not need to have the percentages listed, as when
        a percentage value is omitted, the included percentages are added
        together and subtracted from 100%. The result, if greater than 0, is
        then divided equally between all images with omitted percentages. In the
        last example, the sum of both percentages is not 100%, and therefore
        both images include their respective opacities. If no percentages are
        declared and three images are included, each image will be 33.33%
        opaque. The two following are lines (almost) identical:If no percentages
        are declared, both the images will be 50% opaque, with a cross-fade
        rendering as an even merge of both images. The 50%/50% example seen
        above did not need to have the percentages listed, as when a percentage
        value is omitted, the included percentages are added together and
        subtracted from 100%. The result, if greater than 0, is then divided
        equally between all images with omitted percentages. In the last
        example, the sum of both percentages is not 100%, and therefore both
        images include their respective opacities. If no percentages are
        declared and three images are included, each image will be 33.33%
        opaque. The two following are lines (almost) identical: If no
        percentages are declared, both the images will be 50% opaque, with a
        cross-fade rendering as an even merge of both images. The 50%/50%
        example seen above did not need to have the percentages listed, as when
        a percentage value is omitted, the included percentages are added
        together and subtracted from 100%. The result, if greater than 0, is
        then divided equally between all images with omitted percentages. In the
        last example, the sum of both percentages is not 100%, and therefore
        both images include their respective opacities. If no percentages are
        declared and three images are included, each image will be 33.33%
        opaque. The two following are lines (almost) identical: If no
        percentages are declared, both the images will be 50% opaque, with a
        cross-fade rendering as an even merge of both images. The 50%/50%
        example seen above did not need to have the percentages listed, as when
        a percentage value is omitted, the included percentages are added
        together and subtracted from 100%. The result, if greater than 0, is
        then divided equally between all images with omitted percentages. In the
        last example, the sum of both percentages is not 100%, and therefore
        both images include their respective opacities. If no percentages are
        declared and three images are included, each image will be 33.33%
        opaque. The two following are lines (almost) identical: If no
        percentages are declared, both the images will be 50% opaque, with a
        cross-fade rendering as an even merge of both images. The 50%/50%
        example seen above did not need to have the percentages listed, as when
        a percentage value is omitted, the included percentages are added
        together and subtracted from 100%. The result, if greater than 0, is
        then divided equally between all images with omitted percentages. In the
        last example, the sum of both percentages is not 100%, and therefore
        both images include their respective opacities. If no percentages are
        declared and three images are included, each image will be 33.33%
        opaque. The two following are lines (almost) identical: If no
        percentages are declared, both the images will be 50% opaque, with a
        cross-fade rendering as an even merge of both images. The 50%/50%
        example seen above did not need to have the percentages listed, as when
        a percentage value is omitted, the included percentages are added
        together and subtracted from 100%. The result, if greater than 0, is
        then divided equally between all images with omitted percentages. In the
        last example, the sum of both percentages is not 100%, and therefore
        both images include their respective opacities. If no percentages are
        declared and three images are included, each image will be 33.33%
        opaque. The two following are lines (almost) identical: If no
        percentages are declared, both the images will be 50% opaque, with a
        cross-fade rendering as an even merge of both images. The 50%/50%
        example seen above did not need to have the percentages listed, as when
        a percentage value is omitted, the included percentages are added
        together and subtracted from 100%. The result, if greater than 0, is
        then divided equally between all images with omitted percentages. In the
        last example, the sum of both percentages is not 100%, and therefore
        both images include their respective opacities. If no percentages are
        declared and three images are included, each image will be 33.33%
        opaque. The two following are lines (almost) identical: If no
        percentages are declared, both the images will be 50% opaque, with a
        cross-fade rendering as an even merge of both images. The 50%/50%
        example seen above did not need to have the percentages listed, as when
        a percentage value is omitted, the included percentages are added
        together and subtracted from 100%. The result, if greater than 0, is
        then divided equally between all images with omitted percentages. In the
        last example, the sum of both percentages is not 100%, and therefore
        both images include their respective opacities. If no percentages are
        declared and three images are included, each image will be 33.33%
        opaque. The two following are lines (almost) identical: If no
        percentages are declared, both the images will be 50% opaque, with a
        cross-fade rendering as an even merge of both images. The 50%/50%
        example seen above did not need to have the percentages listed, as when
        a percentage value is omitted, the included percentages are added
        together and subtracted from 100%. The result, if greater than 0, is
        then divided equally between all images with omitted percentages. In the
        last example, the sum of both percentages is not 100%, and therefore
        both images include their respective opacities. If no percentages are
        declared and three images are included, each image will be 33.33%
        opaque. The two following are lines (almost) identical: If no
        percentages are declared, both the images will be 50% opaque, with a
        cross-fade rendering as an even merge of both images. The 50%/50%
        example seen above did not need to have the percentages listed, as when
        a percentage value is omitted, the included percentages are added
        together and subtracted from 100%. The result, if greater than 0, is
        then divided equally between all images with omitted percentages. In the
        last example, the sum of both percentages is not 100%, and therefore
        both images include their respective opacities. If no percentages are
        declared and three images are included, each image will be 33.33%
        opaque. The two following are lines (almost) identical: If no
        percentages are declared, both the images will be 50% opaque, with a
        cross-fade rendering as an even merge of both images. The 50%/50%
        example seen above did not need to have the percentages listed, as when
        a percentage value is omitted, the included percentages are added
        together and subtracted from 100%. The result, if greater than 0, is
        then divided equally between all images with omitted percentages. In the
        last example, the sum of both percentages is not 100%, and therefore
        both images include their respective opacities. If no percentages are
        declared and three images are included, each image will be 33.33%
        opaque. The two following are lines (almost) identical: If no
        percentages are declared, both the images will be 50% opaque, with a
        cross-fade rendering as an even merge of both images. The 50%/50%
        example seen above did not need to have the percentages listed, as when
        a percentage value is omitted, the included percentages are added
        together and subtracted from 100%. The result, if greater than 0, is
        then divided equally between all images with omitted percentages. In the
        last example, the sum of both percentages is not 100%, and therefore
        both images include their respective opacities. If no percentages are
        declared and three images are included, each image will be 33.33%
        opaque. The two following are lines (almost) identical: If no
        percentages are declared, both the images will be 50% opaque, with a
        cross-fade rendering as an even merge of both images. The 50%/50%
        example seen above did not need to have the percentages listed, as when
        a percentage value is omitted, the included percentages are added
        together and subtracted from 100%. The result, if greater than 0, is
        then divided equally between all images with omitted percentages. In the
        last example, the sum of both percentages is not 100%, and therefore
        both images include their respective opacities. If no percentages are
        declared and three images are included, each image will be 33.33%
        opaque. The two following are lines (almost) identical: If no
        percentages are declared, both the images will be 50% opaque, with a
        cross-fade rendering as an even merge of both images. The 50%/50%
        example seen above did not need to have the percentages listed, as when
        a percentage value is omitted, the included percentages are added
        together and subtracted from 100%. The result, if greater than 0, is
        then divided equally between all images with omitted percentages. In the
        last example, the sum of both percentages is not 100%, and therefore
        both images include their respective opacities. If no percentages are
        declared and three images are included, each image will be 33.33%
        opaque. The two following are lines (almost) identical:If no percentages
        are declared, both the images will be 50% opaque, with a cross-fade
        rendering as an even merge of both images. The 50%/50% example seen
        above did not need to have the percentages listed, as when a percentage
        value is omitted, the included percentages are added together and
        subtracted from 100%. The result, if greater than 0, is then divided
        equally between all images with omitted percentages. In the last
        example, the sum of both percentages is not 100%, and therefore both
        images include their respective opacities. If no percentages are
        declared and three images are included, each image will be 33.33%
        opaque. The two following are lines (almost) identical: If no
        percentages are declared, both the images will be 50% opaque, with a
        cross-fade rendering as an even merge of both images. The 50%/50%
        example seen above did not need to have the percentages listed, as when
        a percentage value is omitted, the included percentages are added
        together and subtracted from 100%. The result, if greater than 0, is
        then divided equally between all images with omitted percentages. In the
        last example, the sum of both percentages is not 100%, and therefore
        both images include their respective opacities. If no percentages are
        declared and three images are included, each image will be 33.33%
        opaque. The two following are lines (almost) identical: If no
        percentages are declared, both the images will be 50% opaque, with a
        cross-fade rendering as an even merge of both images. The 50%/50%
        example seen above did not need to have the percentages listed, as when
        a percentage value is omitted, the included percentages are added
        together and subtracted from 100%. The result, if greater than 0, is
        then divided equally between all images with omitted percentages. In the
        last example, the sum of both percentages is not 100%, and therefore
        both images include their respective opacities. If no percentages are
        declared and three images are included, each image will be 33.33%
        opaque. The two following are lines (almost) identical: If no
        percentages are declared, both the images will be 50% opaque, with a
        cross-fade rendering as an even merge of both images. The 50%/50%
        example seen above did not need to have the percentages listed, as when
        a percentage value is omitted, the included percentages are added
        together and subtracted from 100%. The result, if greater than 0, is
        then divided equally between all images with omitted percentages. In the
        last example, the sum of both percentages is not 100%, and therefore
        both images include their respective opacities. If no percentages are
        declared and three images are included, each image will be 33.33%
        opaque. The two following are lines (almost) identical: If no
        percentages are declared, both the images will be 50% opaque, with a
        cross-fade rendering as an even merge of both images. The 50%/50%
        example seen above did not need to have the percentages listed, as when
        a percentage value is omitted, the included percentages are added
        together and subtracted from 100%. The result, if greater than 0, is
        then divided equally between all images with omitted percentages. In the
        last example, the sum of both percentages is not 100%, and therefore
        both images include their respective opacities. If no percentages are
        declared and three images are included, each image will be 33.33%
        opaque. The two following are lines (almost) identical: If no
        percentages are declared, both the images will be 50% opaque, with a
        cross-fade rendering as an even merge of both images. The 50%/50%
        example seen above did not need to have the percentages listed, as when
        a percentage value is omitted, the included percentages are added
        together and subtracted from 100%. The result, if greater than 0, is
        then divided equally between all images with omitted percentages. In the
        last example, the sum of both percentages is not 100%, and therefore
        both images include their respective opacities. If no percentages are
        declared and three images are included, each image will be 33.33%
        opaque. The two following are lines (almost) identical: If no
        percentages are declared, both the images will be 50% opaque, with a
        cross-fade rendering as an even merge of both images. The 50%/50%
        example seen above did not need to have the percentages listed, as when
        a percentage value is omitted, the included percentages are added
        together and subtracted from 100%. The result, if greater than 0, is
        then divided equally between all images with omitted percentages. In the
        last example, the sum of both percentages is not 100%, and therefore
        both images include their respective opacities. If no percentages are
        declared and three images are included, each image will be 33.33%
        opaque. The two following are lines (almost) identical: If no
        percentages are declared, both the images will be 50% opaque, with a
        cross-fade rendering as an even merge of both images. The 50%/50%
        example seen above did not need to have the percentages listed, as when
        a percentage value is omitted, the included percentages are added
        together and subtracted from 100%. The result, if greater than 0, is
        then divided equally between all images with omitted percentages. In the
        last example, the sum of both percentages is not 100%, and therefore
        both images include their respective opacities. If no percentages are
        declared and three images are included, each image will be 33.33%
        opaque. The two following are lines (almost) identical: If no
        percentages are declared, both the images will be 50% opaque, with a
        cross-fade rendering as an even merge of both images. The 50%/50%
        example seen above did not need to have the percentages listed, as when
        a percentage value is omitted, the included percentages are added
        together and subtracted from 100%. The result, if greater than 0, is
        then divided equally between all images with omitted percentages. In the
        last example, the sum of both percentages is not 100%, and therefore
        both images include their respective opacities. If no percentages are
        declared and three images are included, each image will be 33.33%
        opaque. The two following are lines (almost) identical: If no
        percentages are declared, both the images will be 50% opaque, with a
        cross-fade rendering as an even merge of both images. The 50%/50%
        example seen above did not need to have the percentages listed, as when
        a percentage value is omitted, the included percentages are added
        together and subtracted from 100%. The result, if greater than 0, is
        then divided equally between all images with omitted percentages. In the
        last example, the sum of both percentages is not 100%, and therefore
        both images include their respective opacities. If no percentages are
        declared and three images are included, each image will be 33.33%
        opaque. The two following are lines (almost) identical: If no
        percentages are declared, both the images will be 50% opaque, with a
        cross-fade rendering as an even merge of both images. The 50%/50%
        example seen above did not need to have the percentages listed, as when
        a percentage value is omitted, the included percentages are added
        together and subtracted from 100%. The result, if greater than 0, is
        then divided equally between all images with omitted percentages. In the
        last example, the sum of both percentages is not 100%, and therefore
        both images include their respective opacities. If no percentages are
        declared and three images are included, each image will be 33.33%
        opaque. The two following are lines (almost) identical: If no
        percentages are declared, both the images will be 50% opaque, with a
        cross-fade rendering as an even merge of both images. The 50%/50%
        example seen above did not need to have the percentages listed, as when
        a percentage value is omitted, the included percentages are added
        together and subtracted from 100%. The result, if greater than 0, is
        then divided equally between all images with omitted percentages. In the
        last example, the sum of both percentages is not 100%, and therefore
        both images include their respective opacities. If no percentages are
        declared and three images are included, each image will be 33.33%
        opaque. The two following are lines (almost) identical: If no
        percentages are declared, both the images will be 50% opaque, with a
        cross-fade rendering as an even merge of both images. The 50%/50%
        example seen above did not need to have the percentages listed, as when
        a percentage value is omitted, the included percentages are added
        together and subtracted from 100%. The result, if greater than 0, is
        then divided equally between all images with omitted percentages. In the
        last example, the sum of both percentages is not 100%, and therefore
        both images include their respective opacities. If no percentages are
        declared and three images are included, each image will be 33.33%
        opaque. The two following are lines (almost) identical:If no percentages
        are declared, both the images will be 50% opaque, with a cross-fade
        rendering as an even merge of both images. The 50%/50% example seen
        above did not need to have the percentages listed, as when a percentage
        value is omitted, the included percentages are added together and
        subtracted from 100%. The result, if greater than 0, is then divided
        equally between all images with omitted percentages. In the last
        example, the sum of both percentages is not 100%, and therefore both
        images include their respective opacities. If no percentages are
        declared and three images are included, each image will be 33.33%
        opaque. The two following are lines (almost) identical: If no
        percentages are declared, both the images will be 50% opaque, with a
        cross-fade rendering as an even merge of both images. The 50%/50%
        example seen above did not need to have the percentages listed, as when
        a percentage value is omitted, the included percentages are added
        together and subtracted from 100%. The result, if greater than 0, is
        then divided equally between all images with omitted percentages. In the
        last example, the sum of both percentages is not 100%, and therefore
        both images include their respective opacities. If no percentages are
        declared and three images are included, each image will be 33.33%
        opaque. The two following are lines (almost) identical: If no
        percentages are declared, both the images will be 50% opaque, with a
        cross-fade rendering as an even merge of both images. The 50%/50%
        example seen above did not need to have the percentages listed, as when
        a percentage value is omitted, the included percentages are added
        together and subtracted from 100%. The result, if greater than 0, is
        then divided equally between all images with omitted percentages. In the
        last example, the sum of both percentages is not 100%, and therefore
        both images include their respective opacities. If no percentages are
        declared and three images are included, each image will be 33.33%
        opaque. The two following are lines (almost) identical: If no
        percentages are declared, both the images will be 50% opaque, with a
        cross-fade rendering as an even merge of both images. The 50%/50%
        example seen above did not need to have the percentages listed, as when
        a percentage value is omitted, the included percentages are added
        together and subtracted from 100%. The result, if greater than 0, is
        then divided equally between all images with omitted percentages. In the
        last example, the sum of both percentages is not 100%, and therefore
        both images include their respective opacities. If no percentages are
        declared and three images are included, each image will be 33.33%
        opaque. The two following are lines (almost) identical: If no
        percentages are declared, both the images will be 50% opaque, with a
        cross-fade rendering as an even merge of both images. The 50%/50%
        example seen above did not need to have the percentages listed, as when
        a percentage value is omitted, the included percentages are added
        together and subtracted from 100%. The result, if greater than 0, is
        then divided equally between all images with omitted percentages. In the
        last example, the sum of both percentages is not 100%, and therefore
        both images include their respective opacities. If no percentages are
        declared and three images are included, each image will be 33.33%
        opaque. The two following are lines (almost) identical: If no
        percentages are declared, both the images will be 50% opaque, with a
        cross-fade rendering as an even merge of both images. The 50%/50%
        example seen above did not need to have the percentages listed, as when
        a percentage value is omitted, the included percentages are added
        together and subtracted from 100%. The result, if greater than 0, is
        then divided equally between all images with omitted percentages. In the
        last example, the sum of both percentages is not 100%, and therefore
        both images include their respective opacities. If no percentages are
        declared and three images are included, each image will be 33.33%
        opaque. The two following are lines (almost) identical: If no
        percentages are declared, both the images will be 50% opaque, with a
        cross-fade rendering as an even merge of both images. The 50%/50%
        example seen above did not need to have the percentages listed, as when
        a percentage value is omitted, the included percentages are added
        together and subtracted from 100%. The result, if greater than 0, is
        then divided equally between all images with omitted percentages. In the
        last example, the sum of both percentages is not 100%, and therefore
        both images include their respective opacities. If no percentages are
        declared and three images are included, each image will be 33.33%
        opaque. The two following are lines (almost) identical: If no
        percentages are declared, both the images will be 50% opaque, with a
        cross-fade rendering as an even merge of both images. The 50%/50%
        example seen above did not need to have the percentages listed, as when
        a percentage value is omitted, the included percentages are added
        together and subtracted from 100%. The result, if greater than 0, is
        then divided equally between all images with omitted percentages. In the
        last example, the sum of both percentages is not 100%, and therefore
        both images include their respective opacities. If no percentages are
        declared and three images are included, each image will be 33.33%
        opaque. The two following are lines (almost) identical: If no
        percentages are declared, both the images will be 50% opaque, with a
        cross-fade rendering as an even merge of both images. The 50%/50%
        example seen above did not need to have the percentages listed, as when
        a percentage value is omitted, the included percentages are added
        together and subtracted from 100%. The result, if greater than 0, is
        then divided equally between all images with omitted percentages. In the
        last example, the sum of both percentages is not 100%, and therefore
        both images include their respective opacities. If no percentages are
        declared and three images are included, each image will be 33.33%
        opaque. The two following are lines (almost) identical: If no
        percentages are declared, both the images will be 50% opaque, with a
        cross-fade rendering as an even merge of both images. The 50%/50%
        example seen above did not need to have the percentages listed, as when
        a percentage value is omitted, the included percentages are added
        together and subtracted from 100%. The result, if greater than 0, is
        then divided equally between all images with omitted percentages. In the
        last example, the sum of both percentages is not 100%, and therefore
        both images include their respective opacities. If no percentages are
        declared and three images are included, each image will be 33.33%
        opaque. The two following are lines (almost) identical: If no
        percentages are declared, both the images will be 50% opaque, with a
        cross-fade rendering as an even merge of both images. The 50%/50%
        example seen above did not need to have the percentages listed, as when
        a percentage value is omitted, the included percentages are added
        together and subtracted from 100%. The result, if greater than 0, is
        then divided equally between all images with omitted percentages. In the
        last example, the sum of both percentages is not 100%, and therefore
        both images include their respective opacities. If no percentages are
        declared and three images are included, each image will be 33.33%
        opaque. The two following are lines (almost) identical: If no
        percentages are declared, both the images will be 50% opaque, with a
        cross-fade rendering as an even merge of both images. The 50%/50%
        example seen above did not need to have the percentages listed, as when
        a percentage value is omitted, the included percentages are added
        together and subtracted from 100%. The result, if greater than 0, is
        then divided equally between all images with omitted percentages. In the
        last example, the sum of both percentages is not 100%, and therefore
        both images include their respective opacities. If no percentages are
        declared and three images are included, each image will be 33.33%
        opaque. The two following are lines (almost) identical: If no
        percentages are declared, both the images will be 50% opaque, with a
        cross-fade rendering as an even merge of both images. The 50%/50%
        example seen above did not need to have the percentages listed, as when
        a percentage value is omitted, the included percentages are added
        together and subtracted from 100%. The result, if greater than 0, is
        then divided equally between all images with omitted percentages. In the
        last example, the sum of both percentages is not 100%, and therefore
        both images include their respective opacities. If no percentages are
        declared and three images are included, each image will be 33.33%
        opaque. The two following are lines (almost) identical:If no percentages
        are declared, both the images will be 50% opaque, with a cross-fade
        rendering as an even merge of both images. The 50%/50% example seen
        above did not need to have the percentages listed, as when a percentage
        value is omitted, the included percentages are added together and
        subtracted from 100%. The result, if greater than 0, is then divided
        equally between all images with omitted percentages. In the last
        example, the sum of both percentages is not 100%, and therefore both
        images include their respective opacities. If no percentages are
        declared and three images are included, each image will be 33.33%
        opaque. The two following are lines (almost) identical: If no
        percentages are declared, both the images will be 50% opaque, with a
        cross-fade rendering as an even merge of both images. The 50%/50%
        example seen above did not need to have the percentages listed, as when
        a percentage value is omitted, the included percentages are added
        together and subtracted from 100%. The result, if greater than 0, is
        then divided equally between all images with omitted percentages. In the
        last example, the sum of both percentages is not 100%, and therefore
        both images include their respective opacities. If no percentages are
        declared and three images are included, each image will be 33.33%
        opaque. The two following are lines (almost) identical: If no
        percentages are declared, both the images will be 50% opaque, with a
        cross-fade rendering as an even merge of both images. The 50%/50%
        example seen above did not need to have the percentages listed, as when
        a percentage value is omitted, the included percentages are added
        together and subtracted from 100%. The result, if greater than 0, is
        then divided equally between all images with omitted percentages. In the
        last example, the sum of both percentages is not 100%, and therefore
        both images include their respective opacities. If no percentages are
        declared and three images are included, each image will be 33.33%
        opaque. The two following are lines (almost) identical: If no
        percentages are declared, both the images will be 50% opaque, with a
        cross-fade rendering as an even merge of both images. The 50%/50%
        example seen above did not need to have the percentages listed, as when
        a percentage value is omitted, the included percentages are added
        together and subtracted from 100%. The result, if greater than 0, is
        then divided equally between all images with omitted percentages. In the
        last example, the sum of both percentages is not 100%, and therefore
        both images include their respective opacities. If no percentages are
        declared and three images are included, each image will be 33.33%
        opaque. The two following are lines (almost) identical: If no
        percentages are declared, both the images will be 50% opaque, with a
        cross-fade rendering as an even merge of both images. The 50%/50%
        example seen above did not need to have the percentages listed, as when
        a percentage value is omitted, the included percentages are added
        together and subtracted from 100%. The result, if greater than 0, is
        then divided equally between all images with omitted percentages. In the
        last example, the sum of both percentages is not 100%, and therefore
        both images include their respective opacities. If no percentages are
        declared and three images are included, each image will be 33.33%
        opaque. The two following are lines (almost) identical: If no
        percentages are declared, both the images will be 50% opaque, with a
        cross-fade rendering as an even merge of both images. The 50%/50%
        example seen above did not need to have the percentages listed, as when
        a percentage value is omitted, the included percentages are added
        together and subtracted from 100%. The result, if greater than 0, is
        then divided equally between all images with omitted percentages. In the
        last example, the sum of both percentages is not 100%, and therefore
        both images include their respective opacities. If no percentages are
        declared and three images are included, each image will be 33.33%
        opaque. The two following are lines (almost) identical: If no
        percentages are declared, both the images will be 50% opaque, with a
        cross-fade rendering as an even merge of both images. The 50%/50%
        example seen above did not need to have the percentages listed, as when
        a percentage value is omitted, the included percentages are added
        together and subtracted from 100%. The result, if greater than 0, is
        then divided equally between all images with omitted percentages. In the
        last example, the sum of both percentages is not 100%, and therefore
        both images include their respective opacities. If no percentages are
        declared and three images are included, each image will be 33.33%
        opaque. The two following are lines (almost) identical: If no
        percentages are declared, both the images will be 50% opaque, with a
        cross-fade rendering as an even merge of both images. The 50%/50%
        example seen above did not need to have the percentages listed, as when
        a percentage value is omitted, the included percentages are added
        together and subtracted from 100%. The result, if greater than 0, is
        then divided equally between all images with omitted percentages. In the
        last example, the sum of both percentages is not 100%, and therefore
        both images include their respective opacities. If no percentages are
        declared and three images are included, each image will be 33.33%
        opaque. The two following are lines (almost) identical: If no
        percentages are declared, both the images will be 50% opaque, with a
        cross-fade rendering as an even merge of both images. The 50%/50%
        example seen above did not need to have the percentages listed, as when
        a percentage value is omitted, the included percentages are added
        together and subtracted from 100%. The result, if greater than 0, is
        then divided equally between all images with omitted percentages. In the
        last example, the sum of both percentages is not 100%, and therefore
        both images include their respective opacities. If no percentages are
        declared and three images are included, each image will be 33.33%
        opaque. The two following are lines (almost) identical: If no
        percentages are declared, both the images will be 50% opaque, with a
        cross-fade rendering as an even merge of both images. The 50%/50%
        example seen above did not need to have the percentages listed, as when
        a percentage value is omitted, the included percentages are added
        together and subtracted from 100%. The result, if greater than 0, is
        then divided equally between all images with omitted percentages. In the
        last example, the sum of both percentages is not 100%, and therefore
        both images include their respective opacities. If no percentages are
        declared and three images are included, each image will be 33.33%
        opaque. The two following are lines (almost) identical: If no
        percentages are declared, both the images will be 50% opaque, with a
        cross-fade rendering as an even merge of both images. The 50%/50%
        example seen above did not need to have the percentages listed, as when
        a percentage value is omitted, the included percentages are added
        together and subtracted from 100%. The result, if greater than 0, is
        then divided equally between all images with omitted percentages. In the
        last example, the sum of both percentages is not 100%, and therefore
        both images include their respective opacities. If no percentages are
        declared and three images are included, each image will be 33.33%
        opaque. The two following are lines (almost) identical: If no
        percentages are declared, both the images will be 50% opaque, with a
        cross-fade rendering as an even merge of both images. The 50%/50%
        example seen above did not need to have the percentages listed, as when
        a percentage value is omitted, the included percentages are added
        together and subtracted from 100%. The result, if greater than 0, is
        then divided equally between all images with omitted percentages. In the
        last example, the sum of both percentages is not 100%, and therefore
        both images include their respective opacities. If no percentages are
        declared and three images are included, each image will be 33.33%
        opaque. The two following are lines (almost) identical: If no
        percentages are declared, both the images will be 50% opaque, with a
        cross-fade rendering as an even merge of both images. The 50%/50%
        example seen above did not need to have the percentages listed, as when
        a percentage value is omitted, the included percentages are added
        together and subtracted from 100%. The result, if greater than 0, is
        then divided equally between all images with omitted percentages. In the
        last example, the sum of both percentages is not 100%, and therefore
        both images include their respective opacities. If no percentages are
        declared and three images are included, each image will be 33.33%
        opaque. The two following are lines (almost) identical:If no percentages
        are declared, both the images will be 50% opaque, with a cross-fade
        rendering as an even merge of both images. The 50%/50% example seen
        above did not need to have the percentages listed, as when a percentage
        value is omitted, the included percentages are added together and
        subtracted from 100%. The result, if greater than 0, is then divided
        equally between all images with omitted percentages. In the last
        example, the sum of both percentages is not 100%, and therefore both
        images include their respective opacities. If no percentages are
        declared and three images are included, each image will be 33.33%
        opaque. The two following are lines (almost) identical: If no
        percentages are declared, both the images will be 50% opaque, with a
        cross-fade rendering as an even merge of both images. The 50%/50%
        example seen above did not need to have the percentages listed, as when
        a percentage value is omitted, the included percentages are added
        together and subtracted from 100%. The result, if greater than 0, is
        then divided equally between all images with omitted percentages. In the
        last example, the sum of both percentages is not 100%, and therefore
        both images include their respective opacities. If no percentages are
        declared and three images are included, each image will be 33.33%
        opaque. The two following are lines (almost) identical: If no
        percentages are declared, both the images will be 50% opaque, with a
        cross-fade rendering as an even merge of both images. The 50%/50%
        example seen above did not need to have the percentages listed, as when
        a percentage value is omitted, the included percentages are added
        together and subtracted from 100%. The result, if greater than 0, is
        then divided equally between all images with omitted percentages. In the
        last example, the sum of both percentages is not 100%, and therefore
        both images include their respective opacities. If no percentages are
        declared and three images are included, each image will be 33.33%
        opaque. The two following are lines (almost) identical: If no
        percentages are declared, both the images will be 50% opaque, with a
        cross-fade rendering as an even merge of both images. The 50%/50%
        example seen above did not need to have the percentages listed, as when
        a percentage value is omitted, the included percentages are added
        together and subtracted from 100%. The result, if greater than 0, is
        then divided equally between all images with omitted percentages. In the
        last example, the sum of both percentages is not 100%, and therefore
        both images include their respective opacities. If no percentages are
        declared and three images are included, each image will be 33.33%
        opaque. The two following are lines (almost) identical: If no
        percentages are declared, both the images will be 50% opaque, with a
        cross-fade rendering as an even merge of both images. The 50%/50%
        example seen above did not need to have the percentages listed, as when
        a percentage value is omitted, the included percentages are added
        together and subtracted from 100%. The result, if greater than 0, is
        then divided equally between all images with omitted percentages. In the
        last example, the sum of both percentages is not 100%, and therefore
        both images include their respective opacities. If no percentages are
        declared and three images are included, each image will be 33.33%
        opaque. The two following are lines (almost) identical: If no
        percentages are declared, both the images will be 50% opaque, with a
        cross-fade rendering as an even merge of both images. The 50%/50%
        example seen above did not need to have the percentages listed, as when
        a percentage value is omitted, the included percentages are added
        together and subtracted from 100%. The result, if greater than 0, is
        then divided equally between all images with omitted percentages. In the
        last example, the sum of both percentages is not 100%, and therefore
        both images include their respective opacities. If no percentages are
        declared and three images are included, each image will be 33.33%
        opaque. The two following are lines (almost) identical: If no
        percentages are declared, both the images will be 50% opaque, with a
        cross-fade rendering as an even merge of both images. The 50%/50%
        example seen above did not need to have the percentages listed, as when
        a percentage value is omitted, the included percentages are added
        together and subtracted from 100%. The result, if greater than 0, is
        then divided equally between all images with omitted percentages. In the
        last example, the sum of both percentages is not 100%, and therefore
        both images include their respective opacities. If no percentages are
        declared and three images are included, each image will be 33.33%
        opaque. The two following are lines (almost) identical: If no
        percentages are declared, both the images will be 50% opaque, with a
        cross-fade rendering as an even merge of both images. The 50%/50%
        example seen above did not need to have the percentages listed, as when
        a percentage value is omitted, the included percentages are added
        together and subtracted from 100%. The result, if greater than 0, is
        then divided equally between all images with omitted percentages. In the
        last example, the sum of both percentages is not 100%, and therefore
        both images include their respective opacities. If no percentages are
        declared and three images are included, each image will be 33.33%
        opaque. The two following are lines (almost) identical: If no
        percentages are declared, both the images will be 50% opaque, with a
        cross-fade rendering as an even merge of both images. The 50%/50%
        example seen above did not need to have the percentages listed, as when
        a percentage value is omitted, the included percentages are added
        together and subtracted from 100%. The result, if greater than 0, is
        then divided equally between all images with omitted percentages. In the
        last example, the sum of both percentages is not 100%, and therefore
        both images include their respective opacities. If no percentages are
        declared and three images are included, each image will be 33.33%
        opaque. The two following are lines (almost) identical: If no
        percentages are declared, both the images will be 50% opaque, with a
        cross-fade rendering as an even merge of both images. The 50%/50%
        example seen above did not need to have the percentages listed, as when
        a percentage value is omitted, the included percentages are added
        together and subtracted from 100%. The result, if greater than 0, is
        then divided equally between all images with omitted percentages. In the
        last example, the sum of both percentages is not 100%, and therefore
        both images include their respective opacities. If no percentages are
        declared and three images are included, each image will be 33.33%
        opaque. The two following are lines (almost) identical: If no
        percentages are declared, both the images will be 50% opaque, with a
        cross-fade rendering as an even merge of both images. The 50%/50%
        example seen above did not need to have the percentages listed, as when
        a percentage value is omitted, the included percentages are added
        together and subtracted from 100%. The result, if greater than 0, is
        then divided equally between all images with omitted percentages. In the
        last example, the sum of both percentages is not 100%, and therefore
        both images include their respective opacities. If no percentages are
        declared and three images are included, each image will be 33.33%
        opaque. The two following are lines (almost) identical: If no
        percentages are declared, both the images will be 50% opaque, with a
        cross-fade rendering as an even merge of both images. The 50%/50%
        example seen above did not need to have the percentages listed, as when
        a percentage value is omitted, the included percentages are added
        together and subtracted from 100%. The result, if greater than 0, is
        then divided equally between all images with omitted percentages. In the
        last example, the sum of both percentages is not 100%, and therefore
        both images include their respective opacities. If no percentages are
        declared and three images are included, each image will be 33.33%
        opaque. The two following are lines (almost) identical: If no
        percentages are declared, both the images will be 50% opaque, with a
        cross-fade rendering as an even merge of both images. The 50%/50%
        example seen above did not need to have the percentages listed, as when
        a percentage value is omitted, the included percentages are added
        together and subtracted from 100%. The result, if greater than 0, is
        then divided equally between all images with omitted percentages. In the
        last example, the sum of both percentages is not 100%, and therefore
        both images include their respective opacities. If no percentages are
        declared and three images are included, each image will be 33.33%
        opaque. The two following are lines (almost) identical:
      </div>
    </main>
  );
}

const Module = styled.div`
  position: relative;
  height: 200px;
  width: 200px;
  background-color: blue;
  ::before {
    content: "";
    position: absolute;
    width: 100%;
    height: 100%;
    background: var(--navfade) bottom center no-repeat;
    background-size: 100% 100%;
    border: 1px solid;
    border-color: yellow;
    transition: 6s;
  }
`;

const ModuleInside = styled.div`
  position: relative;
  color: purple;
`;
